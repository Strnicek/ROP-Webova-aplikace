<script setup>
import { ref } from 'vue';

const email = ref('');
const message = ref('');

 async function resetPassword() {

    message.value = '';

    try {
        const response = await $fetch('api/auth/forgot-password', {
            method: 'POST',
            body: {
                email: email.value
            }
        });

        message.value = response.message;
    }
    catch(error) {
        message.value = error.data?.statusMessage || 'Něco se pokazilo.';
    }
    
}
</script>

<template>
    <h1> Zapomenuté heslo </h1>
    <p> zadejte svůj e-mail pro obnovení hesla </p>

    <form @submit.prevent="resetPassword">
        <input type="email" v-model="email" placeholder="Zadejte svůj e-mail">

        <button type="submit"> Odeslat </button>

        <p v-if="message">{{ message }}</p>

        <NuxtLink to="/login"> Zpět na přihlášení </NuxtLink>
    </form>
</template>