import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import UserEmail from '@/models/UserEmail';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const { name, description, color } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Category name is required' },
                { status: 400 }
            );
        }

        // Find the current category (only active categories)
        const currentCategory = await Category.findOne({
            _id: id,
            status: { $ne: 'deleted' }
        });

        if (!currentCategory) {
            return NextResponse.json(
                { success: false, error: 'Category not found or has been deleted' },
                { status: 404 }
            );
        }

        const oldName = currentCategory.name;

        // Update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description, color },
            { new: true, runValidators: true }
        );

        // If the name changed, update all users with the old category name
        if (oldName !== name) {
            await UserEmail.updateMany(
                { category: oldName },
                { category: name }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedCategory
        });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Category name already exists' },
                { status: 409 }
            );
        }
        console.error('Failed to update category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Find the category first (only active categories)
        const category = await Category.findOne({
            _id: id,
            status: { $ne: 'deleted' }
        });

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found or has been deleted' },
                { status: 404 }
            );
        }

        // Check if there are users in this category
        const userCount = await UserEmail.countDocuments({ category: category.name });
        if (userCount > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot delete category with ${userCount} users. Please reassign or delete users first.`
                },
                { status: 400 }
            );
        }

        // Soft delete: set status to 'deleted' instead of removing the record
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { status: 'deleted' },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
            data: updatedCategory
        });
    } catch (error) {
        console.error('Failed to delete category:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}