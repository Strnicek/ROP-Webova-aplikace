import QRCode from 'qrcode';
import { db } from '../../../prisma/db';
import { getUserFromSession } from '../../utils/auth';
import { createTwoFactorSecret, createTwoFactorURI } from '../../utils/two-factor';
import { encryptSecret } from '../../utils/encryption';

export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event);

    if(!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Nejste přihlášen.'
        });
    }

    const twoFactor = await db.orm.public.TwoFactorAuth
        .where({userId: user.id})
        .first();

    if(twoFactor?.enabled) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Dvoufázové ověření už máte aktivní.'
        });
    }

    const secret = createTwoFactorSecret();
    const encryptedSecret = encryptSecret(secret);

    if(twoFactor) {
        await db.orm.public.TwoFactorAuth
            .where({id: twoFactor.id})
            .update({
                secret: encryptedSecret,
                enabled: false,
                enabledAt: null
            });
    }
    else {
        await db.orm.public.TwoFactorAuth.create({
            userId: user.id,
            secret: encryptedSecret,
            enabled: false
        });
    }

    const uri = createTwoFactorURI(user.email, secret);
    const qrCode = await QRCode.toDataURL(uri);

    setHeader(event, 'Cache-Control', 'no-store');

    return {
        qrCode: qrCode
    };
    
});