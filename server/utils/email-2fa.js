import { randomInt, createHmac } from 'node:crypto';

export function generateEmailCode() {
    const number = randomInt(0, 1000000);
    return number.toString().padStart(6, '0');
}

export function hashEmailCode(userId, code) {
    const secret = process.env.EMAIL_2FA_SECRET;

    if(!secret || secret.length < 32) {
        throw new Error('Chybí bezpečný klíč EMAIL_2FA_SECRET.');
    }

    return createHmac('sha256', secret)
        .update(`${userId}:${code}`)
        .digest('hex');
}