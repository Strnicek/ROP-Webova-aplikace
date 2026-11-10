import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";
import { db } from '../../../prisma/db';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const rememberMe = body?.rememberMe === true;

    if(typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Vyplňte e-mail i heslo!"
        });
    }

    const user = await db.orm.public.User
        .where({email: email})
        .first();

    
    if(user == null) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nesprávný e-mail nebo heslo'
        });
    }

    const passwordCheck = await bcrypt.compare(password, user.passwordHash);

    if(!passwordCheck) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Nesprávný e-mail nebo heslo'
        });
    }

    /*if(user.emailVerifiedAt == null) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Nejdříve si ověřte svůj e-mail'
        });
    }
    */

    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256')
        .update(token)
        .digest('hex');

    const expiresAt = new Date();

    if(rememberMe) {
        expiresAt.setDate(expiresAt.getDate() + 30);
    }
    else {
        expiresAt.setHours(expiresAt.getHours() + 24);
    }

    await db.orm.public.Session.create ({
        userId: user.id,
        tokenHash: tokenHash,
        rememberMe: rememberMe,
        expiresAt: expiresAt
    });

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

});