import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserEmail from '@/models/UserEmail';
import Category from '@/models/Category';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const defaultCategory = formData.get('category') as string;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if (!defaultCategory) {
            return NextResponse.json(
                { success: false, error: 'Category is required' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const results: Record<string, unknown>[] = [];

        return new Promise<NextResponse>((resolve) => {
            const stream = Readable.from(buffer);

            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    const processed = [];
                    const skipped = [];

                    for (const row of results) {
                        try {
                            // Handle simplified CSV format: name, email
                            const email = (row as Record<string, unknown>).email || (row as Record<string, unknown>).Email || (row as Record<string, unknown>).EMAIL;
                            const fullName = String((row as Record<string, unknown>).name || (row as Record<string, unknown>).Name || (row as Record<string, unknown>).NAME || '');

                            // Split full name into first and last name
                            const nameParts = fullName.trim().split(' ');
                            const firstName = nameParts[0] || '';
                            const lastName = nameParts.slice(1).join(' ') || '';

                            if (!email || typeof email !== 'string' || !email.includes('@')) {
                                skipped.push({ row, reason: 'Invalid email address' });
                                continue;
                            }

                            if (!fullName.trim()) {
                                skipped.push({ row, reason: 'Name is required' });
                                continue;
                            }

                            // Check if user already exists
                            const existingUser = await UserEmail.findOne({ email });
                            if (existingUser) {
                                skipped.push({ row, reason: 'Email already exists' });
                                continue;
                            }

                            const user = new UserEmail({
                                email: String(email).trim().toLowerCase(),
                                firstName: firstName.trim(),
                                lastName: lastName.trim(),
                                category: defaultCategory,
                                tags: [], // No tags from CSV, can be added later
                            });

                            await user.save();
                            processed.push(user);

                            // Update category count
                            await Category.findOneAndUpdate(
                                { name: defaultCategory },
                                { $inc: { userCount: 1 } },
                                { upsert: true, setDefaultsOnInsert: true }
                            );

                        } catch {
                            skipped.push({ row, reason: 'Processing error: Unknown error' });
                        }
                    }

                    resolve(NextResponse.json({
                        success: true,
                        data: {
                            processed: processed.length,
                            skipped: skipped.length,
                            total: results.length,
                            skippedDetails: skipped
                        }
                    }));
                })
                .on('error', () => {
                    resolve(NextResponse.json(
                        { success: false, error: 'Failed to parse CSV file' },
                        { status: 400 }
                    ));
                });
        });

    } catch {
        return NextResponse.json(
            { success: false, error: 'Failed to process CSV upload' },
            { status: 500 }
        );
    }
}