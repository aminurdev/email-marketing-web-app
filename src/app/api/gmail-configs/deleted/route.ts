import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';

// Get all deleted Gmail configurations
export async function GET() {
    try {
        await connectDB();

        const deletedConfigs = await GmailConfig.find({
            status: 'deleted'
        }).select('-password').sort({ updatedAt: -1 });

        return NextResponse.json({
            success: true,
            data: deletedConfigs
        });
    } catch (error) {
        console.error('Failed to fetch deleted Gmail configurations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch deleted Gmail configurations' },
            { status: 500 }
        );
    }
}