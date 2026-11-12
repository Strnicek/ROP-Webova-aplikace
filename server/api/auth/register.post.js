import bcrypt from 'bcryptjs';
import { db } from '../../../prisma/db';
import { randomBytes, createHash } from 'node:crypto';
import { sendEmail } from '../../utils/mailer';


export default defineEventHandler(async (event) => {

  const body = await readBody(event);

  const username = body?.username?.trim();
  const email = body?.email?.toLowerCase();
  const password = body?.password;
  const passwordAgain = body?.passwordAgain;

  if (!username || !email || !password || !passwordAgain) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vyplňte všechna pole.'
    });
  }

  if (username.length < 3 || username.length > 24) {
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

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Heslo musí být delší než 8 znaků'
    });
  }

  if (password != passwordAgain) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hesla se neshodují'
    });
  }

  const emailExist = await db.orm.public.User
    .where({ email: email })
    .first();


  if (emailExist != null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tento email už byl použit při registraci'
    });
  }

  const usernameExist = await db.orm.public.User
    .where({ username: username })
    .first();

  if (usernameExist != null) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Zadané uživatelské jméno už existuje'
    })
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await db.orm.public.User.create({
    username: username,
    email: email,
    passwordHash: passwordHash,
    emailVerifiedAt: null
  });

  const token = randomBytes(32).toString('hex');

  const tokenHash = createHash('sha256')
    .update(token)
    .digest('hex');

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await db.orm.public.EmailVerification.create({
    userId: newUser.id,
    tokenHash: tokenHash,
    expiresAt: expiresAt
  })

  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  await sendEmail(
    email,
    'Ověření e-mailu - StudyFlow',
    `
        <h2>Vítejte ve StudyFlow!</h2>

        <p>Děkujeme za registraci.</p>

        <p>Pro ověření e-mailu klikněte na odkaz:</p>

        <a href="${verificationUrl}">Ověřit e-mail</a>

        <p>Odkaz je platný 24 hodin.</p>
    `
  );

  return {
    message: 'Registrace proběhla úspěšně!',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  };
});