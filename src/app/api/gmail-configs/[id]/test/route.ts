import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';
import EmailLog from '@/models/EmailLog';
import { emailService } from '@/lib/nodemailer';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { testEmail } = body;
        const { id } = await params;

        if (!testEmail || !testEmail.includes('@')) {
            return NextResponse.json(
                { success: false, error: 'Valid test email is required' },
                { status: 400 }
            );
        }

        // Get Gmail configuration
        const config = await GmailConfig.findById(id);
        if (!config) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration not found' },
                { status: 404 }
            );
        }

        if (!config.isActive) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration is not active' },
                { status: 400 }
            );
        }

        // Check daily limit
        if (config.sentToday >= config.dailyLimit) {
            return NextResponse.json(
                { success: false, error: 'Daily email limit reached' },
                { status: 429 }
            );
        }

        try {
            // For debugging - use password directly (temporarily)
            console.log('Email:', config.email);
            console.log('Password length:', config.password.length);
            console.log('Password starts with:', config.password.substring(0, 4));

            const configForService = {
                ...config.toObject(),
                password: config.password // Temporarily use direct password
            };

            const initialized = await emailService.createTransporter(configForService);
            if (!initialized) {
                return NextResponse.json(
                    { success: false, error: 'Failed to initialize email service. Please check your Gmail credentials.' },
                    { status: 400 }
                );
            }

            // Send test email
            const result = await emailService.sendEmail({
                to: testEmail,
                subject: 'Test Email from Email Campaign Manager',
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3B82F6;">🎉 Test Email Successful!</h2>
            <p>Congratulations! Your Gmail configuration is working correctly.</p>
            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">Configuration Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${config.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${config.email}</p>
              <p style="margin: 5px 0;"><strong>Daily Limit:</strong> ${config.dailyLimit}</p>
              <p style="margin: 5px 0;"><strong>Sent Today:</strong> ${config.sentToday + 1}</p>
            </div>
            <p>You can now use this configuration to send email campaigns to your users.</p>
            <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
            <p style="color: #6B7280; font-size: 14px;">
              This is an automated test email from your Email Campaign Manager.
            </p>
          </div>
        `,
                text: `
Test Email Successful!

Congratulations! Your Gmail configuration is working correctly.

Configuration Details:
- Name: ${config.name}
- Email: ${config.email}
- Daily Limit: ${config.dailyLimit}
- Sent Today: ${config.sentToday + 1}

You can now use this configuration to send email campaigns to your users.

This is an automated test email from your Email Campaign Manager.
        `
            });

            if (result.success) {
                // Update sent count
                await GmailConfig.findByIdAndUpdate(id, {
                    $inc: { sentToday: 1 }
                });

                // Log the email send
                const emailLog = new EmailLog({
                    recipientEmail: testEmail,
                    recipientName: 'Test User',
                    recipientCategory: 'Test',
                    gmailConfigId: id,
                    gmailConfigName: config.name,
                    subject: 'Test Email from Email Campaign Manager',
                    status: 'sent',
                    messageId: result.messageId,
                    sentAt: new Date()
                });
                await emailLog.save();

                return NextResponse.json({
                    success: true,
                    message: 'Test email sent successfully!',
                    messageId: result.messageId
                });
            } else {
                return NextResponse.json(
                    { success: false, error: result.error || 'Failed to send test email' },
                    { status: 400 }
                );
            }

        } catch (emailError: unknown) {
            console.error('Email sending error:', emailError);

            // Provide more specific error messages
            let errorMessage = 'Failed to send test email';
            if (emailError && typeof emailError === 'object' && 'message' in emailError) {
                const message = emailError.message as string;
                if (message.includes('Invalid login')) {
                    errorMessage = 'Invalid Gmail credentials. Please check your email and app password.';
                } else if (message.includes('authentication')) {
                    errorMessage = 'Authentication failed. Make sure you\'re using an App Password, not your regular Gmail password.';
                } else if (message.includes('ENOTFOUND')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                }
            }

            return NextResponse.json(
                { success: false, error: errorMessage },
                { status: 400 }
            );
        } finally {
            emailService.close();
        }

    } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}