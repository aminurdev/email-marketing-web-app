import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';


export async function GET() {
    try {
        await connectDB();

        // First, update any configs that don't have isActive field or status field
        await GmailConfig.updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );

        await GmailConfig.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'active' } }
        );

        // Only return configurations that are not deleted
        const configs = await GmailConfig.find({
            status: { $ne: 'deleted' }
        }).select('-password');

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

        // Check if there's already an active config with this email
        const existingActiveConfig = await GmailConfig.findOne({
            email,
            status: 'active'
        });

        if (existingActiveConfig) {
            return NextResponse.json(
                { success: false, error: 'An active Gmail configuration with this email already exists' },
                { status: 409 }
            );
        }

        // Check if there's a deleted config with this email
        const existingDeletedConfig = await GmailConfig.findOne({
            email,
            status: 'deleted'
        });

        if (existingDeletedConfig) {
            // Option 1: Restore the deleted config with new details
            // Option 2: Create a new config (current approach)
            // We'll go with Option 2 for now, but inform the user
            console.log(`Creating new config for email ${email} (previous config was deleted)`);
        }

        // For debugging - temporarily store password in plain text
        // TODO: Re-enable encryption after debugging
        const config = new GmailConfig({
            name,
            email,
            password: password, // Temporarily plain text
            dailyLimit,
            isActive: true, // Explicitly set to true when creating
            status: 'active' // Explicitly set status
        });

        await config.save();

        // Return without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...configData } = config.toObject();
        return NextResponse.json({
            success: true,
            data: configData,
            message: existingDeletedConfig
                ? 'Gmail configuration created successfully (replaced previously deleted configuration)'
                : 'Gmail configuration created successfully'
        }, { status: 201 });
    } catch (error: unknown) {
        console.error('Failed to create Gmail configuration:', error);

        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            // This should be rare now with our pre-checks, but handle it gracefully
            return NextResponse.json(
                { success: false, error: 'A Gmail configuration with this email already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'Failed to create Gmail configuration' },
            { status: 500 }
        );
    }
}