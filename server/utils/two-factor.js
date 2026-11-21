import { generateSecret, generateURI, verify } from 'otplib';

export function createTwoFactorSecret() {
    return generateSecret();
}

export function createTwoFactorURI(email, secret) {
    return generateURI({
        issuer: 'StudyFlow',
        label: email,
        secret: secret
    });
}

export async function verifyTwoFactorCode(secret, code) {
    const result = await verify({
        secret: secret,
        token: code
    });
    
    return result.valid;
}