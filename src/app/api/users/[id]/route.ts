import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserEmail from '@/models/UserEmail';
import Category from '@/models/Category';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Find the user first to get the category
        const user = await UserEmail.findById(id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Delete the user
        await UserEmail.findByIdAndDelete(id);

        // Update category user count (only for active categories)
        await Category.findOneAndUpdate(
            { name: user.category, status: { $ne: 'deleted' } },
            { $inc: { userCount: -1 } }
        );

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}