import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';
import { encrypt } from '@/lib/encryption';

export async function GET() {
    try {
        await connectDB();
        const configs = await GmailConfig.find({}).select('-password');
        return NextResponse.json({ success: true, data: configs });
    } catch (error) {
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
        });

        await config.save();

        // Return without password
        const { password: _, ...configData } = config.toObject();
        return NextResponse.json({ success: true, data: configData }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
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