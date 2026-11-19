import { randomBytes, createHash } from 'node:crypto';
import { db } from '../../../prisma/db';
import { sendEmail } from '../../utils/mailer';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const email = body?.email.trim().toLowerCase();

    if(!email) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Zadejte e-mailovou adresu.'
        })
    }

    const user = await db.orm.public.User
        .where({email: email})
        .first();

    if(!user) {
        return {
            message: 'Pokud účet existuje, pošleme vám e-mail s odkazem pro obnovení hesla.'
        };
    }

    await db.orm.public.PasswordReset
        .where({ userId: user.id })
        .delete();

    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256')
        .update(token)
        .digest('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await db.orm.public.PasswordReset.create({
        userId: user.id,
        tokenHash: tokenHash,
        expiresAt: expiresAt
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

     await sendEmail(
        email,
        'Obnovení hesla - StudyFlow',
        `
            <h2>Obnovení hesla</h2>

            <p>Požádali jste o obnovení hesla do StudyFlow.</p>

            <p>Klikněte na následující odkaz:</p>

            <a href="${resetUrl}">Obnovit heslo</a>

            <p>Odkaz je platný jednu hodinu.</p>
        `
    );

    return {
        message: 'Pokud účet existuje, pošleme vám e-mail s odkazem pro obnovení hesla.'
    }
})