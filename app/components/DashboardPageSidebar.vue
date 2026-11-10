<script setup>

const user = useState('auth-user');

async function logout() {
    try {
        await $fetch('/api/auth/logout', {

            method:'POST'
        });

         user.value = null;

        await navigateTo('/login');
    }
    catch(error) {
        console.error('Chyba při odhlašování:', error);
    }

}

</script>

<template>
    <h1> Dashboard StudyFlow </h1>

    <button @click="logout"> Odhlásit se </button>
</template>