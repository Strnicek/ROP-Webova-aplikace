
import { sendEmail } from '../../utils/mailer';

export default defineEventHandler(async (event) => {

    if (process.env.NODE_ENV !== 'development') {
        throw createError({
            statusCode: 404
        });
    }

    await sendEmail(
        'strnadj.08@spst.eu',
        'Test StudyFlow',
        '<h1>Ahoj!</h1><p>Odesílání e-mailů funguje.</p>'
    );

    return {
        message: 'E-mail byl odeslán!'
    };

});
