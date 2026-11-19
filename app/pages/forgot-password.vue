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
    <article class="password-container">
        <div class="password-box">
            <div>
                <h1 class="password-headline"> Zapomenuté heslo </h1>
                <p class="password-subtitle"> Zadejte svůj e-mail pro obnovení hesla </p>
            </div>
             
            <form @submit.prevent="resetPassword" >
                <input type="email" v-model="email" placeholder="Zadejte svůj e-mail" class="password-input">

                <button type="submit" class="submit-btn"> Odeslat </button>

                <p v-if="message">{{ message }}</p>

                <NuxtLink to="/login" class="verify-btn"> Zpět na přihlášení </NuxtLink>
            </form>
        </div>
    </article>
    
</template>