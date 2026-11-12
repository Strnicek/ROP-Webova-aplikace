
import { createHash } from 'node:crypto';
import { db } from '../../../prisma/db';

export default defineEventHandler(async (event) => {

    // Získáme token z požadavku
    const body = await readBody(event);
    const token = body?.token;

    if (!token || typeof token !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Neplatný ověřovací odkaz.'
        });
    }

    // Vytvoříme hash tokenu
    const tokenHash = createHash('sha256')
        .update(token)
        .digest('hex');

    // Najdeme token v databázi
    const verification = await db.orm.public.EmailVerification
        .where({ tokenHash: tokenHash })
        .first();

    if (!verification) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ověřovací odkaz neexistuje.'
        });
    }

    // Zkontrolujeme, jestli už byl použit
    if (verification.usedAt) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Ověřovací odkaz už byl použit.'
        });
    }

    // Zkontrolujeme platnost odkazu
    if (new Date(verification.expiresAt) <= new Date()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Platnost ověřovacího odkazu vypršela.'
        });
    }

    // Najdeme uživatele
    const user = await db.orm.public.User
        .where({ id: verification.userId })
        .first();

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Uživatel neexistuje.'
        });
    }

    if (user.emailVerifiedAt) {
        throw createError({
            statusCode: 400,
            statusMessage: 'E-mail už byl ověřen.'
        });
    }

    // Potvrdíme e-mail uživatele
    await db.orm.public.User
        .where({ id: user.id })
        .update({
            emailVerifiedAt: new Date()
        });

    // Označíme token jako použitý
    await db.orm.public.EmailVerification
        .where({ id: verification.id })
        .update({
            usedAt: new Date()
        });

    return {
        message: 'E-mail byl úspěšně ověřen!'
    };

});
