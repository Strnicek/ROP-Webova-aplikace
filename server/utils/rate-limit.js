const attempts = new Map();

export function rateLimit(key, maxAttempts = 5, windowMinutes = 15) {
    const now = Date.now();

    const record = attempts.get(key);

    if(!record || now >= record.expiresAt) {
        attempts.set(key, {
            count: 1,
            expiresAt: now + windowMinutes * 60 * 1000
        });

        return;
    }

    if(record.count >= maxAttempts) {
        throw createError({
            statusCode: 429,
            statusMessage: 'Příliš mnoho pokusů. Zkuste to později.'
        });
    }

    record.count++;
}