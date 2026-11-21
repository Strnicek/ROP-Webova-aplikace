import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

function getEncryptionKey() {
    const key = process.env.TWO_FACTOR_ENCRYPTION_KEY;

    if(!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
        throw new Error('Neplatný šifrovací klíč pro 2FA.');
    }

    return Buffer.from(key, 'hex');
}

export function encryptSecret(secret) {
    const key = getEncryptionKey();
    const iv = randomBytes(12);

    const cipher = createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([
        cipher.update(secret, 'utf8'),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':');
}

export function decryptSecret(encryptedSecret) {
    const key = getEncryptionKey();

    const [ivHex, tagHex, dataHex] = encryptedSecret.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(dataHex, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return decrypted.toString('utf8');
}