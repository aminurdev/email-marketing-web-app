import nodemailer from 'nodemailer';
import { GmailConfig } from './types';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;
    private currentConfig: GmailConfig | null = null;

    async createTransporter(config: GmailConfig) {
        this.currentConfig = config;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email,
                pass: config.password, // App password
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Email service verification failed:', error);
            return false;
        }
    }

    async sendEmail(options: {
        to: string;
        subject: string;
        html: string;
        text?: string;
    }) {
        if (!this.transporter || !this.currentConfig) {
            throw new Error('Email service not initialized');
        }

        try {
            const result = await this.transporter.sendMail({
                from: `"${this.currentConfig.name}" <${this.currentConfig.email}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });

            return {
                success: true,
                messageId: result.messageId,
            };
        } catch (error) {
            console.error('Failed to send email:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async sendBulkEmails(
        emails: Array<{
            to: string;
            subject: string;
            html: string;
            text?: string;
        }>,
        onProgress?: (sent: number, total: number) => void
    ) {
        if (!this.transporter || !this.currentConfig) {
            throw new Error('Email service not initialized');
        }

        const results = [];
        let sent = 0;

        for (const email of emails) {
            try {
                const result = await this.sendEmail(email);
                results.push({ email: email.to, ...result });

                if (result.success) {
                    sent++;
                }

                // Rate limiting - wait between emails
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (onProgress) {
                    onProgress(sent, emails.length);
                }
            } catch (error) {
                results.push({
                    email: email.to,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return results;
    }

    close() {
        if (this.transporter) {
            this.transporter.close();
            this.transporter = null;
            this.currentConfig = null;
        }
    }
}

export const emailService = new EmailService();