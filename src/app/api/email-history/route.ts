import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailLog from '@/models/EmailLog';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const gmailConfigId = searchParams.get('gmailConfigId');
        const search = searchParams.get('search');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');

        // Build query
        let query: any = {};

        if (status) {
            query.status = status;
        }

        if (category) {
            query.recipientCategory = category;
        }

        if (gmailConfigId) {
            query.gmailConfigId = gmailConfigId;
        }

        if (search) {
            query.$or = [
                { recipientEmail: { $regex: search, $options: 'i' } },
                { recipientName: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }

        if (dateFrom || dateTo) {
            query.sentAt = {};
            if (dateFrom) {
                query.sentAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                query.sentAt.$lte = new Date(dateTo);
            }
        }

        const skip = (page - 1) * limit;

        const [logs, total, stats] = await Promise.all([
            EmailLog.find(query)
                .populate('gmailConfigId', 'name email')
                .populate('campaignId', 'name')
                .sort({ sentAt: -1 })
                .skip(skip)
                .limit(limit),
            EmailLog.countDocuments(query),
            EmailLog.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Format stats
        const statusStats = {
            sent: 0,
            failed: 0,
            bounced: 0,
            delivered: 0,
            opened: 0,
            clicked: 0
        };

        stats.forEach(stat => {
            statusStats[stat._id as keyof typeof statusStats] = stat.count;
        });

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            stats: statusStats
        });

    } catch (error) {
        console.error('Failed to fetch email history:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch email history' },
            { status: 500 }
        );
    }
}