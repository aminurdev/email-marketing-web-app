import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// Restore a deleted category
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Restore the category by setting status back to 'active'
        const category = await Category.findByIdAndUpdate(
            id,
            { status: 'active' },
            { new: true }
        );

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Category restored successfully',
            data: category
        });
    } catch (error) {
        console.error('Failed to restore category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to restore category' },
            { status: 500 }
        );
    }
}