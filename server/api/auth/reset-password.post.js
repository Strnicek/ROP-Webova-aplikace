
import bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';
import { db } from '../../../prisma/db';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const token = body?.token;
    const password = body?.password;

    if (!token || typeof token !== 'string' || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Chybí potřebné údaje.'
        });
    }

    if (password.length < 8) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Heslo musí být delší než 8 znaků.'
        });
    }

    const tokenHash = createHash('sha256')
        .update(token)
        .digest('hex');

    const reset = await db.orm.public.PasswordReset
        .where({ tokenHash: tokenHash })
        .first();

    if (!reset) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Obnovovací odkaz je neplatný.'
        });
    }

    if (reset.usedAt) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tento odkaz už byl použit.'
        });
    }

    if (new Date(reset.expiresAt) <= new Date()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Platnost odkazu už vypršela.'
        });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.transaction(async (tx) => {

        const claimTime = new Date();

        const claimedReset = await tx.orm.public.PasswordReset
            .where({
                id: reset.id,
                usedAt: null
            })
            .where((p) => p.expiresAt.gt(claimTime))
            .update({
                usedAt: claimTime
            });

        if (!claimedReset) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Tento odkaz už byl použit nebo vypršel.'
            });
        }

        const user = await tx.orm.public.User
            .where({ id: reset.userId })
            .first();

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Uživatel nebyl nalezen.'
            });
        }

        await tx.orm.public.User
            .where({ id: user.id })
            .update({
                passwordHash: passwordHash
            });

        await tx.orm.public.Session
            .where({ userId: user.id })
            .deleteAll();

    });

    deleteCookie(event, 'auth_token');

    return {
        message: 'Heslo bylo úspěšně změněno!'
    };

});
