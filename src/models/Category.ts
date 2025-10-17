import mongoose from 'mongoose';
import { Category } from '@/lib/types';

const CategorySchema = new mongoose.Schema<Category>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    color: { type: String, default: '#3B82F6' },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
    userCount: { type: Number, default: 0 },
}, {
    timestamps: true
});

export default mongoose.models.Category || mongoose.model<Category>('Category', CategorySchema);