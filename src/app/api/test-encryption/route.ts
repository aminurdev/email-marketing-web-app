import { NextRequest, NextResponse } from 'next/server';
import { encrypt, decrypt } from '@/lib/encryption';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        const encrypted = encrypt(password);
        const decrypted = decrypt(encrypted);

        return NextResponse.json({
            success: true,
            data: {
                original: password,
                encrypted: encrypted,
                decrypted: decrypted,
                matches: password === decrypted,
                originalLength: password.length,
                decryptedLength: decrypted.length,
            }
        });

    } catch (error) {
        console.error('Encryption test error:', error);
        return NextResponse.json(
            { success: false, error: 'Encryption test failed' },
            { status: 500 }
        );
    }
}