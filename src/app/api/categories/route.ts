import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import UserEmail from '@/models/UserEmail';

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json({ success: true, data: categories });
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, description, color = '#3B82F6' } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Category name is required' },
                { status: 400 }
            );
        }

        // Count existing users in this category
        const userCount = await UserEmail.countDocuments({ category: name });

        const category = new Category({
            name,
            description,
            color,
            userCount,
        });

        await category.save();
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Category already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        );
    }
}