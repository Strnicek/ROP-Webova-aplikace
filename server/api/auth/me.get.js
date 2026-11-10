import { getUserFromSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
    
    const user = await getUserFromSession(event);

    if(!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Nejste přihlášený'
        });
    }

    return {
        loggedIn: true,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name
        }
    };
});