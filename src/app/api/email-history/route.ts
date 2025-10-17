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
        const query: Record<string, unknown> = {};

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
            const sentAtQuery: Record<string, Date> = {};
            if (dateFrom) {
                sentAtQuery.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                sentAtQuery.$lte = new Date(dateTo);
            }
            query.sentAt = sentAtQuery;
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

        if (stats && Array.isArray(stats)) {
            stats.forEach(stat => {
                if (stat && stat._id && typeof stat.count === 'number') {
                    const statusKey = stat._id as keyof typeof statusStats;
                    if (statusKey in statusStats) {
                        statusStats[statusKey] = stat.count;
                    }
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: logs || [],
            pagination: {
                page,
                limit,
                total: total || 0,
                pages: Math.ceil((total || 0) / limit) || 1
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