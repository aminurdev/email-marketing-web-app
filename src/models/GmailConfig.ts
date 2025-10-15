import mongoose from 'mongoose';
import { GmailConfig } from '@/lib/types';

const GmailConfigSchema = new mongoose.Schema<GmailConfig>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    dailyLimit: { type: Number, default: 500 },
    sentToday: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now },
}, {
    timestamps: true
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