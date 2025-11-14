import { randomBytes } from 'node:crypto';

/**
 * Generates a secure CSRF token
 * @param length - length in bytes, default 24 (produces 48-character hex string)
 * @returns CSRF token as a hex string
 */
export function generateCsrfToken(length = 24): string {
    if (length <= 0 || !Number.isInteger(length)) {
        throw new Error('CSRF token length must be a positive integer');
    }

    return randomBytes(length).toString('hex');
}