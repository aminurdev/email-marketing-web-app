export interface GmailConfig {
    _id?: string;
    name: string;
    email: string;
    password: string; // App password
    isActive: boolean;
    dailyLimit: number;
    sentToday: number;
    lastResetDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserEmail {
    _id?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    category: string;
    tags: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmailCampaign {
    _id?: string;
    name: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    recipients: string[]; // User email IDs
    gmailConfigId: string;
    status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
    scheduledAt?: Date;
    sentCount: number;
    failedCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmailLog {
    _id?: string;
    campaignId?: string;
    recipientEmail: string;
    recipientName?: string;
    recipientCategory?: string;
    gmailConfigId: string;
    gmailConfigName: string;
    subject: string;
    status: 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened' | 'clicked';
    error?: string;
    messageId?: string;
    sentAt: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    clickedAt?: Date;
    metadata?: {
        userAgent?: string;
        ipAddress?: string;
        location?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    _id?: string;
    name: string;
    description?: string;
    color: string;
    userCount: number;
    createdAt: Date;
}