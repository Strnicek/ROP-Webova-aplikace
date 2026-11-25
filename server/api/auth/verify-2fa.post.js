import { randomBytes, createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '../../../prisma/db';
import { hashEmailCode } from '../../utils/email-2fa';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    const code = body?.code;

    if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Zadejte platný šestimístný kód.'
        });
    }

    const cookie = getCookie(event, 'pending_2fa');

    if(!cookie) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Ověření vypršelo. Přihlaste se znovu.'
        });
    }

    const parts = cookie.split(':');

    if(parts.length !== 4) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Neplatné ověření.'
        });
    }

    const [codeId, userId, rememberMe, signature] = parts;

    const data = `${codeId}:${userId}:${rememberMe}`;

    const expectedSignature = createHmac('sha256', process.env.EMAIL_2FA_SECRET)
        .update(data)
        .digest('hex');

     if (
        !/^\d+$/.test(codeId) ||
        !/^\d+$/.test(userId) ||
        !['0', '1'].includes(rememberMe) ||
        !/^[0-9a-f]{64}$/.test(signature) ||
        !timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSignature, 'hex')
        )
    ) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Neplatné ověření.'
        });
    }

    const verification = await db.orm.public.EmailTwoFactorCode
        .where({id: Number(codeId), userId: Number(userId)})
        .first();

    if (!verification || verification.usedAt || new Date(verification.expiresAt) <= new Date() || verification.attempts >= 5) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ověřovací kód vypršel nebo už není platný.'
        });
    }

    const codeHash = hashEmailCode(Number(userId), code);

    if(codeHash !== verification.codeHash) {
        await db.orm.public.EmailTwoFactorCode
            .where({
                id: verification.id,
                attempts: verification.attempts,
                usedAt: null
            })
            .update({attempts: verification.attempts + 1});

        throw createError({
            statusCode: 400,
            statusMessage: 'Nesprávný ověřovací kód.'
        });
    }

    const user = await db.orm.public.User
        .where({id: Number(userId)})
        .first();
    
    if(!user || !user.emailTwoFactorEnabled) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Přihlášení nelze dokončit.'
        });
    } 

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256')
        .update(token)
        .digest('hex');

    const expiresAt = new Date();

    if(rememberMe === '1') {
        expiresAt.setDate(expiresAt.getDate() + 30);
    }
    else {
        expiresAt.setHours(expiresAt.getHours() + 24);
    }

    await db.transaction(async (tx) => {
        const usedCode = await tx.orm.public.EmailTwoFactorCode
            .where({
                id: verification.id,
                userId: user.id,
                codeHash: codeHash,
                attempts: verification.attempts,
                usedAt: null
            })
            .where((p) => p.expiresAt.gt(new Date()))
            .update({usedAt: new Date()});

        if(!usedCode) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Ověřovací kód už není platný.'
            });
        }

        await tx.orm.public.Session.create({
            userId: user.id,
            tokenHash: tokenHash,
            rememberMe: rememberMe === '1',
            expiresAt: expiresAt
        });
    });

    deleteCookie(event, 'pending_2fa');

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt
    });

    return {
        message: 'Přihlášení proběhlo úspěšně!'
    };
})