import { randomBytes, createHash } from 'node:crypto';

export function generateRecoveryCodes() {
    const codes = [];

    for(let i = 0; i < 10; i++) {
        const code = randomBytes(16).toString('hex');
        codes.push(code);
    }

    return codes;
}

export function hashRecoveryCode(code) {
     const normalCode = code.trim().replace(/[\s-]/g, '').toLowerCase();

     return createHash('sha256')
        .update(normalCode)
        .digest('hex');
}

