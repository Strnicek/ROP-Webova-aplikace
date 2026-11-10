export default defineNuxtRouteMiddleware(async () => {
    
    const user = useState('auth-user');
    const authLoaded = useState('auth-loaded');

    if(!authLoaded.value) {
        try {
            const requestFetch = useRequestFetch();
            const response = await requestFetch('/api/auth/me');

            user.value = response.user;
        }
        catch(error) {
            user.value = null;
        }

        authLoaded.value = true;
    }

    if(!user.value) {
        return navigateTo('/login');
    }
})