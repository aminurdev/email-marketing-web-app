import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

interface MigrationResult {
    name: string;
    success: boolean;
    message: string;
    actions: string[];
    error?: string;
}

export async function POST() {
    try {
        await connectDB();

        const results: MigrationResult[] = [];

        // Migration 1: User Email Indexes (email + category compound unique)
        try {
            const userEmailResult = await migrateUserEmailIndexes();
            results.push(userEmailResult);
        } catch (error) {
            results.push({
                name: 'User Email Indexes',
                success: false,
                message: 'Failed to migrate user email indexes',
                actions: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // Migration 2: Gmail Config Indexes (email + status partial unique)
        try {
            const gmailConfigResult = await migrateGmailConfigIndexes();
            results.push(gmailConfigResult);
        } catch (error) {
            results.push({
                name: 'Gmail Config Indexes',
                success: false,
                message: 'Failed to migrate Gmail config indexes',
                actions: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // Migration 3: Category Status Fields
        try {
            const categoryResult = await migrateCategoryStatus();
            results.push(categoryResult);
        } catch (error) {
            results.push({
                name: 'Category Status Fields',
                success: false,
                message: 'Failed to migrate category status fields',
                actions: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        // Migration 4: Gmail Config Status Fields
        try {
            const gmailStatusResult = await migrateGmailConfigStatus();
            results.push(gmailStatusResult);
        } catch (error) {
            results.push({
                name: 'Gmail Config Status Fields',
                success: false,
                message: 'Failed to migrate Gmail config status fields',
                actions: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }

        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;

        return NextResponse.json({
            success: successCount === totalCount,
            message: `Database migration completed. ${successCount}/${totalCount} migrations successful.`,
            results,
            summary: {
                total: totalCount,
                successful: successCount,
                failed: totalCount - successCount
            }
        });

    } catch (error) {
        console.error('Database migration failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                results: []
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const status = {
            userEmailIndexes: await checkUserEmailIndexes(),
            gmailConfigIndexes: await checkGmailConfigIndexes(),
            categoryStatus: await checkCategoryStatus(),
            gmailConfigStatus: await checkGmailConfigStatus()
        };

        return NextResponse.json({
            success: true,
            status,
            needsMigration: Object.values(status).some(s => !s.isCorrect)
        });

    } catch (error) {
        console.error('Failed to check migration status:', error);
        return NextResponse.json(
            { success: false, error: `Failed to check status: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}

// Migration Functions

async function migrateUserEmailIndexes(): Promise<MigrationResult> {
    const collection = mongoose.connection.db?.collection('useremails');
    if (!collection) {
        throw new Error('UserEmail collection not found');
    }

    const indexes = await collection.indexes();
    const actions: string[] = [];

    // Check for old unique email index
    const oldEmailIndex = indexes.find(index =>
        index.key &&
        index.key.email === 1 &&
        index.unique === true &&
        !index.key.category
    );

    if (oldEmailIndex) {
        await collection.dropIndex(oldEmailIndex.name!);
        actions.push(`Dropped old unique email index: ${oldEmailIndex.name}`);
    }

    // Check for compound unique index
    const compoundIndex = indexes.find(index =>
        index.key &&
        index.key.email === 1 &&
        index.key.category === 1 &&
        index.unique === true
    );

    if (!compoundIndex) {
        await collection.createIndex(
            { email: 1, category: 1 },
            { unique: true, name: 'email_category_unique' }
        );
        actions.push('Created compound unique index: email_category_unique');
    }

    return {
        name: 'User Email Indexes',
        success: true,
        message: actions.length > 0 ? 'User email indexes migrated successfully' : 'User email indexes already correct',
        actions
    };
}

async function migrateGmailConfigIndexes(): Promise<MigrationResult> {
    const collection = mongoose.connection.db?.collection('gmailconfigs');
    if (!collection) {
        throw new Error('GmailConfig collection not found');
    }

    const indexes = await collection.indexes();
    const actions: string[] = [];

    // Check for old unique email index
    const oldEmailIndex = indexes.find(index =>
        index.key &&
        index.key.email === 1 &&
        index.unique === true &&
        !index.key.status &&
        !index.partialFilterExpression
    );

    if (oldEmailIndex) {
        await collection.dropIndex(oldEmailIndex.name!);
        actions.push(`Dropped old unique email index: ${oldEmailIndex.name}`);
    }

    // Check for compound partial unique index
    const compoundIndex = indexes.find(index =>
        index.key &&
        index.key.email === 1 &&
        index.key.status === 1 &&
        index.unique === true &&
        index.partialFilterExpression
    );

    if (!compoundIndex) {
        await collection.createIndex(
            { email: 1, status: 1 },
            {
                unique: true,
                name: 'email_status_unique',
                partialFilterExpression: { status: 'active' }
            }
        );
        actions.push('Created compound partial unique index: email_status_unique');
    }

    return {
        name: 'Gmail Config Indexes',
        success: true,
        message: actions.length > 0 ? 'Gmail config indexes migrated successfully' : 'Gmail config indexes already correct',
        actions
    };
}

async function migrateCategoryStatus(): Promise<MigrationResult> {
    const collection = mongoose.connection.db?.collection('categories');
    if (!collection) {
        throw new Error('Category collection not found');
    }

    const actions: string[] = [];

    // Update categories without status field
    const result = await collection.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'active' } }
    );

    if (result.modifiedCount > 0) {
        actions.push(`Updated ${result.modifiedCount} categories with missing status field`);
    }

    return {
        name: 'Category Status Fields',
        success: true,
        message: actions.length > 0 ? 'Category status fields migrated successfully' : 'Category status fields already correct',
        actions
    };
}

async function migrateGmailConfigStatus(): Promise<MigrationResult> {
    const collection = mongoose.connection.db?.collection('gmailconfigs');
    if (!collection) {
        throw new Error('GmailConfig collection not found');
    }

    const actions: string[] = [];

    // Update Gmail configs without status field
    const statusResult = await collection.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'active' } }
    );

    if (statusResult.modifiedCount > 0) {
        actions.push(`Updated ${statusResult.modifiedCount} Gmail configs with missing status field`);
    }

    // Update Gmail configs without isActive field
    const activeResult = await collection.updateMany(
        { isActive: { $exists: false } },
        { $set: { isActive: true } }
    );

    if (activeResult.modifiedCount > 0) {
        actions.push(`Updated ${activeResult.modifiedCount} Gmail configs with missing isActive field`);
    }

    return {
        name: 'Gmail Config Status Fields',
        success: true,
        message: actions.length > 0 ? 'Gmail config status fields migrated successfully' : 'Gmail config status fields already correct',
        actions
    };
}

// Status Check Functions

async function checkUserEmailIndexes() {
    try {
        const collection = mongoose.connection.db?.collection('useremails');
        if (!collection) return { isCorrect: false, message: 'Collection not found' };

        const indexes = await collection.indexes();

        const hasOldIndex = indexes.some(index =>
            index.key &&
            index.key.email === 1 &&
            index.unique === true &&
            !index.key.category
        );

        const hasNewIndex = indexes.some(index =>
            index.key &&
            index.key.email === 1 &&
            index.key.category === 1 &&
            index.unique === true
        );

        return {
            isCorrect: !hasOldIndex && hasNewIndex,
            message: hasOldIndex ? 'Old unique email index exists' : hasNewIndex ? 'Correct compound index exists' : 'Missing compound index'
        };
    } catch (error) {
        return { isCorrect: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

async function checkGmailConfigIndexes() {
    try {
        const collection = mongoose.connection.db?.collection('gmailconfigs');
        if (!collection) return { isCorrect: false, message: 'Collection not found' };

        const indexes = await collection.indexes();

        const hasOldIndex = indexes.some(index =>
            index.key &&
            index.key.email === 1 &&
            index.unique === true &&
            !index.key.status &&
            !index.partialFilterExpression
        );

        const hasNewIndex = indexes.some(index =>
            index.key &&
            index.key.email === 1 &&
            index.key.status === 1 &&
            index.unique === true &&
            index.partialFilterExpression
        );

        return {
            isCorrect: !hasOldIndex && hasNewIndex,
            message: hasOldIndex ? 'Old unique email index exists' : hasNewIndex ? 'Correct partial unique index exists' : 'Missing partial unique index'
        };
    } catch (error) {
        return { isCorrect: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

async function checkCategoryStatus() {
    try {
        const collection = mongoose.connection.db?.collection('categories');
        if (!collection) return { isCorrect: true, message: 'Collection not found (optional)' };

        const missingStatus = await collection.countDocuments({ status: { $exists: false } });

        return {
            isCorrect: missingStatus === 0,
            message: missingStatus > 0 ? `${missingStatus} categories missing status field` : 'All categories have status field'
        };
    } catch (error) {
        return { isCorrect: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}

async function checkGmailConfigStatus() {
    try {
        const collection = mongoose.connection.db?.collection('gmailconfigs');
        if (!collection) return { isCorrect: true, message: 'Collection not found (optional)' };

        const missingStatus = await collection.countDocuments({ status: { $exists: false } });
        const missingActive = await collection.countDocuments({ isActive: { $exists: false } });

        return {
            isCorrect: missingStatus === 0 && missingActive === 0,
            message: missingStatus > 0 || missingActive > 0
                ? `${missingStatus} configs missing status, ${missingActive} missing isActive`
                : 'All Gmail configs have required fields'
        };
    } catch (error) {
        return { isCorrect: false, message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}