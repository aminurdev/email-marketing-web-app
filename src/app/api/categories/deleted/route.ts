import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// Get all deleted categories
export async function GET() {
    try {
        await connectDB();

        const deletedCategories = await Category.find({
            status: 'deleted'
        }).sort({ updatedAt: -1 });

        return NextResponse.json({
            success: true,
            data: deletedCategories
        });
    } catch (error) {
        console.error('Failed to fetch deleted categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch deleted categories' },
            { status: 500 }
        );
    }
}