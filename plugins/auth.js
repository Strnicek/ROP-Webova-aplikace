export default defineNuxtPlugin(async () => {
    const user = useState('auth-user', () => null);
    const authLoaded = useState('auth-loaded', () => false);

    try {
        const requestFetch = useRequestFetch();

        const response = await requestFetch('api/auth/me');

        user.value = response.user;
    }
    catch(error) {
        user.value = null;
    }
    finally {
        authLoaded.value = true;
    }
})