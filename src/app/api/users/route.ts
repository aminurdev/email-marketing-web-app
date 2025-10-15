import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserEmail from '@/models/UserEmail';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search');

        let query: any = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const users = await UserEmail.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await UserEmail.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, firstName, lastName, category, tags = [] } = body;

        if (!email || !category) {
            return NextResponse.json(
                { success: false, error: 'Email and category are required' },
                { status: 400 }
            );
        }

        const user = new UserEmail({
            email,
            firstName,
            lastName,
            category,
            tags,
        });

        await user.save();

        // Update category user count
        await Category.findOneAndUpdate(
            { name: category },
            { $inc: { userCount: 1 } },
            { upsert: true }
        );

        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Email already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to create user' },
            { status: 500 }
        );
    }
}