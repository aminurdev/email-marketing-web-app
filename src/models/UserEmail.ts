import mongoose from 'mongoose';
import { UserEmail } from '@/lib/types';

const UserEmailSchema = new mongoose.Schema<UserEmail>({
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

// Create compound unique index on email and category
// This allows the same email to exist in different categories
UserEmailSchema.index({ email: 1, category: 1 }, { unique: true, name: 'email_category_unique' });
UserEmailSchema.index({ category: 1 });

// Ensure old indexes are handled properly
UserEmailSchema.pre('init', function () {
    // This will be called when the model is initialized
    // The migration endpoint should handle dropping old indexes
});

export default mongoose.models.UserEmail || mongoose.model<UserEmail>('UserEmail', UserEmailSchema);