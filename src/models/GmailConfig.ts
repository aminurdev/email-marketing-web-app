import mongoose from 'mongoose';
import { GmailConfig } from '@/lib/types';

const GmailConfigSchema = new mongoose.Schema<GmailConfig>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
    dailyLimit: { type: Number, default: 500 },
    sentToday: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now },
}, {
    timestamps: true
});

// Create compound unique index to allow same email with different statuses
// but only one active config per email
GmailConfigSchema.index({ email: 1, status: 1 }, {
    unique: true,
    name: 'email_status_unique',
    partialFilterExpression: { status: 'active' }
});

// Reset daily count if it's a new day
GmailConfigSchema.pre('save', function () {
    const today = new Date();
    const lastReset = new Date(this.lastResetDate);

    if (today.toDateString() !== lastReset.toDateString()) {
        this.sentToday = 0;
        this.lastResetDate = today;
    }
});

export default mongoose.models.GmailConfig || mongoose.model<GmailConfig>('GmailConfig', GmailConfigSchema);