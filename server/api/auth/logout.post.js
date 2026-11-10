import { createHash } from 'node:crypto';
import { db } from '../../../prisma/db';

export default defineEventHandler(async (event) => {

    try {
         const token = getCookie(event, 'auth_token');

        if(token) {
            const tokenHash = createHash('sha256')
                .update(token)
                .digest('hex');

            const deletedSession = await db.orm.public.Session
                .where({tokenHash: tokenHash})
                .delete();

            console.log('Smazaná session:', deletedSession);
        }

        deleteCookie(event, 'auth_token');

        return {
            message: 'Odhlášení proběhlo úspěšně!'
        };

    }
    catch(error) {
        console.error('Chyba při odhlašování:', error);
        throw error;
    }
   
});

