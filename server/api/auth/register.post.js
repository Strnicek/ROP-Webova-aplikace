import bcrypt from 'bcryptjs';
import { db } from '../../../prisma/db';


export default defineEventHandler(async (event) =>  {

    const body = await readBody(event);

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

    if(username.length < 3 || username.length > 24) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Uživatelské jméno musí být v rozmezí 3-24 znaků'

        });
    }

     const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailCheck.test(email)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Zadejte platnou e-mailovou adresu.'
        });
      }

      if(password.length < 8) {
        throw createError ({
            statusCode: 400,
            statusMessage: 'Heslo musí být delší než 8 znaků'
        });
      }

      if(password != passwordAgain) {
        throw createError ({
            statusCode: 400,
            statusMessage: 'Hesla se neshodují'
        });
      }

      const emailExist = await db.orm.public.User
        .where({ email: email })
        .first();

    
      if(emailExist != null) {
        throw createError ({
            statusCode: 400,
            statusMessage: 'Tento email už byl použit při registraci'
        });
      }

      const usernameExist = await db.orm.public.User
        .where({username: username})
        .first();

      if(usernameExist != null) {
        throw createError ({
            statusCode: 400,
            statusMessage: 'Zadané uživatelské jméno už existuje'
        })
      }

      const passwordHash = await bcrypt.hash(password,12);

      const newUser = await db.orm.public.User.create({
          username: username,
          email: email,
          passwordHash: passwordHash,
          emailVerifiedAt: null
       });

       return {
        message: 'Registrace proběhla úspěšně!',
          user: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email
          }
        };
});