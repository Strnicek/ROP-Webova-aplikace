import bcrypt from 'bcryptjs';
import { db } from '../../../prisma/db';
import { getUserFromSession } from '../../utils/auth';
import { rateLimit } from '../../utils/rate-limit';

export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event);

    if(!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Nejste přihlášen.'
        });
    }

    rateLimit(`disable-2fa:${user.id}`, 5, 15);

    const body = await readBody(event);
    const password = body?.password;

    if(typeof password !== 'string' || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Zadejte své heslo.'
        });
    }

    const account = await db.orm.public.User
        .where({id: user.id })
        .first();

    if(!account) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Uživatel nebyl nalezen.'
        });
    }

    const validPassword = await bcrypt.compare(password, account.passwordHash);

    if(!validPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nesprávné heslo.'
        });
    }

    if(!account.emailTwoFactorEnabled) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Dvoufázové ověření není aktivní.'
        });
    }

    await db.transaction(async (tx) => {
        await tx.orm.public.User
            .where({id: user.id})
            .update({emailTwoFactorEnabled: false});

        await tx.orm.public.EmailTwoFactorCode
            .where({userId: user.id})
            .deleteAll();
    });

    return {
        message: 'Dvoufázové ověření bylo úspěšně vypnuto.'
    };
});