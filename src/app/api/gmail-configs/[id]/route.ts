import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GmailConfig from '@/models/GmailConfig';
import { encrypt } from '@/lib/encryption';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, email, password, dailyLimit, isActive } = body;
        const { id } = await params;

        const updateData: Record<string, unknown> = { name, email, dailyLimit, isActive };

        if (password) {
            updateData.password = encrypt(password);
        }

        const config = await GmailConfig.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!config) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: config });
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to update Gmail configuration' },
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
        const config = await GmailConfig.findByIdAndDelete(id);

        if (!config) {
            return NextResponse.json(
                { success: false, error: 'Gmail configuration not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Configuration deleted' });
    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to delete Gmail configuration' },
            { status: 500 }
        );
    }
}