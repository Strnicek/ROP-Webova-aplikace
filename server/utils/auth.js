import { createHash } from "node:crypto";
import { db } from '../../prisma/db';

export async function getUserFromSession(event) {

    const token = getCookie(event, 'auth_token');

    if(!token) {
        return null;
    }

    const tokenHash = createHash('sha256')
        .update(token)
        .digest('hex');

    const session = await db.orm.public.Session
        .where({tokenHash: tokenHash})
        .first();

    if(!session) {
        return null;
    }

    if(new Date(session.expiresAt) < new Date()) {
        return null;
    }

    const user = await db.orm.public.User
        .where({id: session.userId})
        .first();

    return user || null;
}