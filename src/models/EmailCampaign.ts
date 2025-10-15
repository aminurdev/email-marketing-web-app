import mongoose from 'mongoose';
import { EmailCampaign } from '@/lib/types';

const EmailCampaignSchema = new mongoose.Schema<EmailCampaign>({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    htmlContent: { type: String, required: true },
    textContent: { type: String },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserEmail' }],
    gmailConfigId: { type: mongoose.Schema.Types.ObjectId, ref: 'GmailConfig', required: true },
    status: {
        type: String,
        enum: ['draft', 'scheduled', 'sending', 'completed', 'failed'],
        default: 'draft'
    },
    scheduledAt: { type: Date },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
}, {
    timestamps: true
});

export default mongoose.models.EmailCampaign || mongoose.model<EmailCampaign>('EmailCampaign', EmailCampaignSchema);