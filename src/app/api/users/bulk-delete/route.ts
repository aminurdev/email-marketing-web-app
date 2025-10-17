import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserEmail from '@/models/UserEmail';
import Category from '@/models/Category';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { userIds } = body;

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json(
                { success: false, error: 'User IDs array is required' },
                { status: 400 }
            );
        }

        // Find all users to get their categories before deletion
        const users = await UserEmail.find({ _id: { $in: userIds } });

        if (users.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No users found' },
                { status: 404 }
            );
        }

        // Count users by category
        const categoryCount: Record<string, number> = {};
        users.forEach(user => {
            categoryCount[user.category] = (categoryCount[user.category] || 0) + 1;
        });

        // Delete all users
        const deleteResult = await UserEmail.deleteMany({ _id: { $in: userIds } });

        // Update category user counts (only for active categories)
        const updatePromises = Object.entries(categoryCount).map(([categoryName, count]) =>
            Category.findOneAndUpdate(
                { name: categoryName, status: { $ne: 'deleted' } },
                { $inc: { userCount: -count } }
            )
        );

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            message: `${deleteResult.deletedCount} users deleted successfully`,
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Failed to bulk delete users:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete users' },
            { status: 500 }
        );
    }
}