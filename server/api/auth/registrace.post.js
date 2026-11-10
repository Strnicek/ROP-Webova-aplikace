import bcrypt from 'bcryptjs';
import { db } from '../../../prisma/db';


export default defineEventHandler(async (event) =>  {

    const body = await body(event);

    const username = body?.username?.trim();
    const email = body?.email?.toLowerCase();
    const password = body?.password;
    const passwordAgain = body?.passwordAgain;

    if(!username || !email || !password || !passwordAgain) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Vyplňte všechna pole.'
        });
    }
});