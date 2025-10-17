import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserEmail from '@/models/UserEmail';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { email, firstName, lastName, category } = body;

        if (!email || !category) {
            return NextResponse.json(
                { success: false, error: 'Email and category are required' },
                { status: 400 }
            );
        }

        console.log('Attempting to create user:', { email, category });

        // Check if user already exists in this specific category
        const existingUser = await UserEmail.findOne({ email, category });
        if (existingUser) {
            return NextResponse.json({
                success: false,
                error: 'User with this email already exists in this category',
                existing: true
            }, { status: 409 });
        }

        // Check if user exists in other categories
        const usersInOtherCategories = await UserEmail.find({ email, category: { $ne: category } });

        const user = new UserEmail({
            email,
            firstName,
            lastName,
            category,
        });

        await user.save();
        console.log('User created successfully:', user);

        return NextResponse.json({
            success: true,
            data: user,
            message: usersInOtherCategories.length > 0
                ? `User created successfully. This email also exists in ${usersInOtherCategories.length} other categories.`
                : 'User created successfully.'
        }, { status: 201 });

    } catch (error: unknown) {
        console.error('Error creating user:', error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            // Get the error details
            const errorMessage = 'message' in error ? String(error.message) : 'Duplicate key error';
            console.log('Duplicate key error details:', errorMessage);

            return NextResponse.json(
                {
                    success: false,
                    error: 'User with this email already exists in this category',
                    details: errorMessage
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create user',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}