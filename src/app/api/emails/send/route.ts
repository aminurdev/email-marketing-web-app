import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';
import UserEmail from '@/models/UserEmail';
import EmailCampaign from '@/models/EmailCampaign';
import EmailLog from '@/models/EmailLog';
import { emailService } from '@/lib/nodemailer';


export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const {
            campaignName,
            subject,
            htmlContent,
            textContent,
            recipients, // Array of user email IDs or categories
            gmailConfigId,
            scheduleAt
        } = body;

        if (!campaignName || !subject || !htmlContent || !gmailConfigId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get Gmail configuration (only active, non-deleted configs)
        const gmailConfig = await GmailConfig.findOne({
            _id: gmailConfigId,
            status: { $ne: 'deleted' }
        });

        if (!gmailConfig || !gmailConfig.isActive) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration not found, inactive, or has been deleted' },
                { status: 404 }
            );
        }

        // Check daily limit
        if (gmailConfig.sentToday >= gmailConfig.dailyLimit) {
            return NextResponse.json(
                { success: false, error: 'Daily email limit reached for this configuration' },
                { status: 429 }
            );
        }

        // Get recipient emails
        let recipientUsers = [];
        if (recipients.includes('all')) {
            recipientUsers = await UserEmail.find({ isActive: true });
        } else if (recipients.some((r: string) => r.startsWith('category:'))) {
            const categories = recipients
                .filter((r: string) => r.startsWith('category:'))
                .map((r: string) => r.replace('category:', ''));
            recipientUsers = await UserEmail.find({
                category: { $in: categories },
                isActive: true
            });
        } else {
            recipientUsers = await UserEmail.find({
                _id: { $in: recipients },
                isActive: true
            });
        }

        if (recipientUsers.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No valid recipients found' },
                { status: 400 }
            );
        }

        // Create campaign
        const campaign = new EmailCampaign({
            name: campaignName,
            subject,
            htmlContent,
            textContent,
            recipients: recipientUsers.map(u => u._id),
            gmailConfigId,
            status: scheduleAt ? 'scheduled' : 'sending',
            scheduledAt: scheduleAt ? new Date(scheduleAt) : undefined,
        });

        await campaign.save();

        // If not scheduled, send immediately
        if (!scheduleAt) {
            // Start sending in background
            sendEmailsInBackground(campaign._id.toString(), gmailConfig, recipientUsers);

            return NextResponse.json({
                success: true,
                message: 'Email sending started',
                campaignId: campaign._id,
                recipientCount: recipientUsers.length
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Email campaign scheduled',
            campaignId: campaign._id,
            recipientCount: recipientUsers.length,
            scheduledAt: scheduleAt
        });

    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send emails' },
            { status: 500 }
        );
    }
}

async function sendEmailsInBackground(
    campaignId: string,
    gmailConfig: Record<string, unknown> & {
        _id: string;
        password: string;
        name: string;
        toObject: () => Record<string, unknown>;
    },
    recipients: Array<{
        _id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        category: string;
    }>
) {
    try {
        // Initialize email service
        const { decrypt } = await import('@/lib/encryption');
        const decryptedPassword = decrypt(gmailConfig.password);
        const configForService = {
            ...gmailConfig.toObject(),
            password: decryptedPassword
        } as import('@/lib/types').GmailConfig;

        const initialized = await emailService.createTransporter(configForService);
        if (!initialized) {
            throw new Error('Failed to initialize email service');
        }

        const campaign = await EmailCampaign.findById(campaignId);
        if (!campaign) return;

        let sentCount = 0;
        let failedCount = 0;

        // Send emails with rate limiting
        for (const recipient of recipients) {
            try {
                // Check if we've hit the daily limit
                const currentConfig = await GmailConfig.findById(gmailConfig._id);
                if (currentConfig && currentConfig.sentToday >= currentConfig.dailyLimit) {
                    console.log('Daily limit reached, stopping email sending');
                    break;
                }

                const result = await emailService.sendEmail({
                    to: recipient.email,
                    subject: campaign.subject,
                    html: campaign.htmlContent,
                    text: campaign.textContent,
                });

                // Log the email attempt
                const emailLog = new EmailLog({
                    campaignId: campaignId,
                    recipientEmail: recipient.email,
                    recipientName: recipient.firstName && recipient.lastName
                        ? `${recipient.firstName} ${recipient.lastName}`.trim()
                        : recipient.firstName || recipient.lastName || undefined,
                    recipientCategory: recipient.category,
                    gmailConfigId: gmailConfig._id,
                    gmailConfigName: gmailConfig.name,
                    subject: campaign.subject,
                    status: result.success ? 'sent' : 'failed',
                    error: result.success ? undefined : result.error,
                    messageId: result.messageId,
                    sentAt: new Date()
                });
                await emailLog.save();

                if (result.success) {
                    sentCount++;
                    // Update Gmail config sent count
                    await GmailConfig.findByIdAndUpdate(gmailConfig._id, {
                        $inc: { sentToday: 1 }
                    });
                } else {
                    failedCount++;
                    console.error(`Failed to send to ${recipient.email}:`, result.error);
                }

                // Rate limiting - wait 2 seconds between emails
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (error) {
                failedCount++;
                console.error(`Error sending to ${recipient.email}:`, error);

                // Log the error
                const emailLog = new EmailLog({
                    campaignId: campaignId,
                    recipientEmail: recipient.email,
                    recipientName: recipient.firstName && recipient.lastName
                        ? `${recipient.firstName} ${recipient.lastName}`.trim()
                        : recipient.firstName || recipient.lastName || undefined,
                    recipientCategory: recipient.category,
                    gmailConfigId: gmailConfig._id,
                    gmailConfigName: gmailConfig.name,
                    subject: campaign.subject,
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    sentAt: new Date()
                });
                await emailLog.save();
            }
        }

        // Update campaign status
        await EmailCampaign.findByIdAndUpdate(campaignId, {
            status: 'completed',
            sentCount,
            failedCount,
        });

        emailService.close();

    } catch (error) {
        console.error('Background email sending error:', error);
        await EmailCampaign.findByIdAndUpdate(campaignId, {
            status: 'failed',
        });
    }
}