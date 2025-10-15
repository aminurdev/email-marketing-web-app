import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailCampaign from '@/models/EmailCampaign';
import GmailConfig from '@/models/GmailConfig';
import { emailService } from '@/lib/nodemailer';
import EmailLog from '@/models/EmailLog';
import { GmailConfig as GmailConfigType } from '@/lib/types';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const { scheduleAt } = body;

        const campaign = await EmailCampaign.findById(id)
            .populate('recipients', 'email firstName lastName category')
            .populate('gmailConfigId');

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        if (campaign.status !== 'draft') {
            return NextResponse.json(
                { success: false, error: 'Campaign is not in draft status' },
                { status: 400 }
            );
        }

        const gmailConfig = campaign.gmailConfigId as Record<string, unknown> & {
            _id: string;
            isActive: boolean;
            sentToday: number;
            dailyLimit: number;
            name: string;
            password: string;
            toObject: () => Record<string, unknown>;
        };
        if (!gmailConfig || !gmailConfig.isActive) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration not found or inactive' },
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

        // Update campaign status
        const updateData: Record<string, unknown> = {
            status: scheduleAt ? 'scheduled' : 'sending',
            updatedAt: new Date()
        };

        if (scheduleAt) {
            updateData.scheduledAt = new Date(scheduleAt);
        }

        await EmailCampaign.findByIdAndUpdate(id, updateData);

        // If not scheduled, send immediately
        if (!scheduleAt) {
            // Start sending in background
            sendEmailsInBackground(id, gmailConfig, campaign.recipients as Array<{
                email: string;
                firstName?: string;
                lastName?: string;
                category: string;
            }>, campaign);

            return NextResponse.json({
                success: true,
                message: 'Email sending started',
                campaignId: id,
                recipientCount: campaign.recipients.length
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Email campaign scheduled',
            campaignId: id,
            recipientCount: campaign.recipients.length,
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
        isActive: boolean;
        sentToday: number;
        dailyLimit: number;
        name: string;
        password: string;
        toObject: () => Record<string, unknown>;
    },
    recipients: Array<{
        email: string;
        firstName?: string;
        lastName?: string;
        category: string;
    }>,
    campaign: Record<string, unknown> & {
        subject: string;
        htmlContent: string;
        textContent?: string;
    }
) {
    try {
        // Initialize email service
        const configForService = {
            ...gmailConfig.toObject(),
            password: gmailConfig.password // Use direct password (temporarily for debugging)
        } as GmailConfigType;

        const initialized = await emailService.createTransporter(configForService);
        if (!initialized) {
            throw new Error('Failed to initialize email service');
        }

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
            updatedAt: new Date()
        });

        emailService.close();

    } catch (error) {
        console.error('Background email sending error:', error);
        await EmailCampaign.findByIdAndUpdate(campaignId, {
            status: 'failed',
            updatedAt: new Date()
        });
    }
}