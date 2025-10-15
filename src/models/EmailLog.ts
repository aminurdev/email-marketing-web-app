import mongoose from 'mongoose';
import { EmailLog } from '@/lib/types';

const EmailLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailCampaign' },
    recipientEmail: { type: String, required: true },
    recipientName: { type: String },
    recipientCategory: { type: String },
    gmailConfigId: { type: mongoose.Schema.Types.ObjectId, ref: 'GmailConfig', required: true },
    gmailConfigName: { type: String, required: true },
    subject: { type: String, required: true },
    status: {
        type: String,
        enum: ['sent', 'failed', 'bounced', 'delivered', 'opened', 'clicked'],
        default: 'sent'
    },
    error: { type: String },
    messageId: { type: String },
    sentAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
    openedAt: { type: Date },
    clickedAt: { type: Date },
    metadata: {
        userAgent: { type: String },
        ipAddress: { type: String },
        location: { type: String }
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
EmailLogSchema.index({ campaignId: 1 });
EmailLogSchema.index({ recipientEmail: 1 });
EmailLogSchema.index({ recipientCategory: 1 });
EmailLogSchema.index({ gmailConfigId: 1 });
EmailLogSchema.index({ status: 1 });
EmailLogSchema.index({ sentAt: -1 });

export default mongoose.models.EmailLog || mongoose.model('EmailLog', EmailLogSchema);