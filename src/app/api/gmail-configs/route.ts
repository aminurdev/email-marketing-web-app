import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';


export async function GET() {
    try {
        await connectDB();

        // First, update any configs that don't have isActive field
        await GmailConfig.updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );

        const configs = await GmailConfig.find({}).select('-password');

        return NextResponse.json({ success: true, data: configs });
    } catch (error) {
        console.error('Failed to fetch Gmail configurations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch Gmail configurations' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, email, password, dailyLimit = 500 } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // For debugging - temporarily store password in plain text
        // TODO: Re-enable encryption after debugging
        const config = new GmailConfig({
            name,
            email,
            password: password, // Temporarily plain text
            dailyLimit,
            isActive: true, // Explicitly set to true when creating
        });

        await config.save();

        // Return without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...configData } = config.toObject();
        return NextResponse.json({ success: true, data: configData }, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'Email already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to create Gmail configuration' },
            { status: 500 }
        );
    }
}