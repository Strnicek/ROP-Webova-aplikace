import { getUserFromSession } from '../../utils/auth';

export default defineEventHandler(async (event) => {
    const user = await getUserFromSession(event);

    if(!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Nejste přihlášen.'
        });
    }

    return {
        enabled: user.emailTwoFactorEnabled === true
    };
})