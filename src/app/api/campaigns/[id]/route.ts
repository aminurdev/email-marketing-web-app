import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailCampaign from '@/models/EmailCampaign';
import UserEmail from '@/models/UserEmail';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const campaign = await EmailCampaign.findById(id)
            .populate('gmailConfigId', 'name email')
            .populate('recipients', 'email firstName lastName category');

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: campaign });

    } catch (error) {
        console.error('Failed to fetch campaign:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch campaign' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const {
            name,
            subject,
            htmlContent,
            textContent,
            recipients,
            gmailConfigId,
            scheduledAt
        } = body;

        const campaign = await EmailCampaign.findById(id);
        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        // Only allow updates if campaign is in draft status
        if (campaign.status !== 'draft') {
            return NextResponse.json(
                { success: false, error: 'Cannot update campaign that is not in draft status' },
                { status: 400 }
            );
        }

        // Get recipient count for validation
        let recipientUsers = [];
        if (recipients && recipients.length > 0) {
            if (recipients.includes('all')) {
                recipientUsers = await UserEmail.find({ isActive: true });
            } else if (recipients.some((r: string) => r.startsWith('category:'))) {
                const categories = recipients
                    .filter((r: string) => r.startsWith('category:'))
                    .map((r: string) => r.replace('category:', ''));
                recipientUsers = await UserEmail.find({
                    category: { $in: categories },
                    isActive: true
                });
            } else {
                recipientUsers = await UserEmail.find({
                    _id: { $in: recipients },
                    isActive: true
                });
            }
        }

        const updateData: any = {
            name: name || campaign.name,
            subject: subject || campaign.subject,
            htmlContent: htmlContent || campaign.htmlContent,
            textContent: textContent || campaign.textContent,
            gmailConfigId: gmailConfigId || campaign.gmailConfigId,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : campaign.scheduledAt,
            updatedAt: new Date()
        };

        if (recipients && recipients.length > 0) {
            updateData.recipients = recipientUsers.map(u => u._id);
        }

        const updatedCampaign = await EmailCampaign.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('gmailConfigId', 'name email');

        return NextResponse.json({
            success: true,
            data: updatedCampaign,
            recipientCount: recipientUsers.length || campaign.recipients.length
        });

    } catch (error) {
        console.error('Failed to update campaign:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update campaign' },
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

        const campaign = await EmailCampaign.findById(id);
        if (!campaign) {
            return NextResponse.json(
                { success: false, error: 'Campaign not found' },
                { status: 404 }
            );
        }

        // Only allow deletion if campaign is in draft status
        if (campaign.status !== 'draft') {
            return NextResponse.json(
                { success: false, error: 'Cannot delete campaign that is not in draft status' },
                { status: 400 }
            );
        }

        await EmailCampaign.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Campaign deleted successfully'
        });

    } catch (error) {
        console.error('Failed to delete campaign:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete campaign' },
            { status: 500 }
        );
    }
}