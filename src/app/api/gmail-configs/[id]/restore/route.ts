import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';

// Restore a deleted Gmail configuration
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // Restore the configuration by setting status back to 'active'
        const config = await GmailConfig.findByIdAndUpdate(
            id,
            {
                status: 'active',
                isActive: true // Reactivate when restoring
            },
            { new: true }
        ).select('-password');

        if (!config) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Configuration restored successfully',
            data: config
        });
    } catch (error) {
        console.error('Failed to restore Gmail configuration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to restore Gmail configuration' },
            { status: 500 }
        );
    }
}