import mongoose from 'mongoose';
import { UserEmail } from '@/lib/types';

const UserEmailSchema = new mongoose.Schema<UserEmail>({
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

UserEmailSchema.index({ category: 1 });

export default mongoose.models.UserEmail || mongoose.model<UserEmail>('UserEmail', UserEmailSchema);