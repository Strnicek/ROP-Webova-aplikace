<script setup>
import { ref } from 'vue';

const route = useRoute();

const password = ref('');
const passwordAgain = ref('');

const message = ref('');
const errorMessage = ref('');

async function resetPassword() {

    message.value = '';
    errorMessage.value = '';

    const token = route.query.token;

    if(!token || typeof token !== 'string') {
        errorMessage.value = 'Neplatný obnovovací odkaz';
        return;
    }

    if(password.value.length < 8) {
        errorMessage.value = 'Heslo musí být delší než 8 znaků';
        return;
    }

    if(password.value !== passwordAgain.value) {
        errorMessage.value = 'Hesla se musí shodovat, prosím zkontrolujte potvrzení hesla';
        return;
    }

    try {
        const response = await $fetch('/api/auth/reset-password', {
            method: 'POST',
            body: {
                token: token,
                password: password.value
            }
        });

        message.value = response.message;
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Obnovení hesla se nezdařilo.';
    }

}


</script>

<template>
    <main>
        <h1> Obnovení hesla </h1>
        <p> Zadejte své nové heslo </p>

        <form @submit.prevent="resetPassword">
            <div>
                <label> Nové heslo </label>
                <input type="password" v-model="password" placeholder="Zadejte své nové heslo" required>
            </div>

            <div>
                <label> Potvrďte své heslo </label>
                <input type="password" v-model="passwordAgain" placeholder="Potvrďte své nové heslo" required>
            </div>

            <button type="submit"> Změnit heslo </button>
        </form>

        <p v-if="message">{{ message }}</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>

        <NuxtLink v-if="message" to="/login"> Přejít na přihlášení </NuxtLink>
    </main>

</template>