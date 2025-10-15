import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!!';
const ALGORITHM = 'aes-256-cbc';

// Ensure the key is exactly 32 bytes for AES-256
function getKey(): Buffer {
    const key = ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32);
    return Buffer.from(key, 'utf8');
}

export function encrypt(text: string): string {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        // For development, return the original text if encryption fails
        return text;
    }
}

export function decrypt(encryptedText: string): string {
    try {
        // Check if the text contains the IV separator
        if (!encryptedText.includes(':')) {
            // Assume it's plain text (for backward compatibility or development)
            return encryptedText;
        }

        const textParts = encryptedText.split(':');
        if (textParts.length !== 2) {
            // Invalid format, return as-is
            return encryptedText;
        }

        const iv = Buffer.from(textParts[0], 'hex');
        const encrypted = textParts[1];
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        // If decryption fails, assume it's already plain text (for backward compatibility)
        return encryptedText;
    }
}