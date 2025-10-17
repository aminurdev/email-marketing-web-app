import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST() {
    try {
        await connectDB();

        // This endpoint migrates from the old unique email constraint
        // to the new compound unique constraint (email + category)

        const collection = mongoose.connection.db?.collection('useremails');
        if (!collection) {
            throw new Error('Database collection not found');
        }

        // Get current indexes
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        // Check if there's an old unique index on email field
        const emailUniqueIndex = indexes.find(index =>
            index.key &&
            index.key.email === 1 &&
            index.unique === true &&
            !index.key.category // This means it's the old single-field unique index
        );

        if (emailUniqueIndex) {
            console.log('Found old unique email index:', emailUniqueIndex.name);

            // Drop the old unique index
            await collection.dropIndex(emailUniqueIndex.name!);
            console.log('Dropped old unique email index');

            // Ensure the new compound unique index exists
            await collection.createIndex(
                { email: 1, category: 1 },
                { unique: true, name: 'email_category_unique' }
            );
            console.log('Created new compound unique index');

            return NextResponse.json({
                success: true,
                message: 'Migration completed successfully. Old unique email index removed, compound index created.',
                action: 'migrated'
            });
        }

        // Check if compound index already exists
        const compoundIndex = indexes.find(index =>
            index.key &&
            index.key.email === 1 &&
            index.key.category === 1 &&
            index.unique === true
        );

        if (compoundIndex) {
            return NextResponse.json({
                success: true,
                message: 'Database is already migrated. Compound unique index exists.',
                action: 'already_migrated'
            });
        }

        // Create compound index if it doesn't exist
        await collection.createIndex(
            { email: 1, category: 1 },
            { unique: true, name: 'email_category_unique' }
        );

        return NextResponse.json({
            success: true,
            message: 'Compound unique index created successfully.',
            action: 'index_created'
        });

    } catch (error) {
        console.error('Migration failed:', error);
        return NextResponse.json(
            { success: false, error: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const collection = mongoose.connection.db?.collection('useremails');
        if (!collection) {
            throw new Error('Database collection not found');
        }

        // Get current indexes
        const indexes = await collection.indexes();

        return NextResponse.json({
            success: true,
            indexes: indexes.map(index => ({
                name: index.name,
                key: index.key,
                unique: index.unique || false
            }))
        });

    } catch (error) {
        console.error('Failed to get indexes:', error);
        return NextResponse.json(
            { success: false, error: `Failed to get indexes: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}