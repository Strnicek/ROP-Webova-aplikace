import bcrypt from "bcryptjs";
import { randomBytes, createHash, createHmac } from "node:crypto";
import { db } from '../../../prisma/db';
import { generateEmailCode, hashEmailCode } from '../../utils/email-2fa';
import { sendEmail } from '../../utils/mailer';
import { rateLimit } from '../../utils/rate-limit';

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;
    const rememberMe = body?.rememberMe === true;

    const ip = getRequestIP(event, { xForwardedFor: false }) || 'unknown';
    rateLimit(`login:${ip}`, 10, 15);

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

    if(user.emailVerifiedAt == null) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Nejdříve si ověřte svůj e-mail'
        });
    }

    if(user.emailTwoFactorEnabled) {
        const code = generateEmailCode();
        const codeHash = hashEmailCode(user.id, code);

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        await db.orm.public.EmailTwoFactorCode
            .where({userId: user.id})
            .deleteAll();

        const savedCode = await db.orm.public.EmailTwoFactorCode.create({
            userId: user.id,
            codeHash: codeHash,
            expiresAt: expiresAt,
            attempts: 0
        });

        await sendEmail(
            user.email,
            'StudyFlow - Ověřovací kód',
            `
                <h2>Dvoufázové ověření StudyFlow</h2>
                <p>Váš ověřovací kód je:</p>
                <h1>${code}</h1>
                <p>Kód je platný 5 minut.</p>
            `
        );

        const pendingData = `${savedCode.id}:${user.id}:${rememberMe ? 1 : 0}`;

        const signature = createHmac('sha256', process.env.EMAIL_2FA_SECRET)
            .update(pendingData)
            .digest('hex');

        setCookie(event, 'pending_2fa', `${pendingData}:${signature}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 300
        });

        return {
            requiresTwoFactor: true,
            message: 'Na váš e-mail byl odeslán ověřovací kód.'
        };
    }
    

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