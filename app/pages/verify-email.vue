
<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();

const loading = ref(true);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {

    // Získáme token z odkazu
    const token = route.query.token;

    if (!token || typeof token !== 'string') {
        errorMessage.value = 'Ověřovací odkaz je neplatný.';
        loading.value = false;
        return;
    }

    try {
        // Pošleme token na backend
        const response = await $fetch('/api/auth/verify-email', {
            method: 'POST',
            body: {
                token: token
            }
        });

        successMessage.value = response.message;
    }
    catch (error) {
        errorMessage.value = error.data?.statusMessage || 'Ověření e-mailu se nezdařilo.';
    }
    finally {
        loading.value = false;
    }

});
</script>

<template>
    <article class="email">
        <h1>Ověření e-mailu</h1>

        <p v-if="loading">
            Probíhá ověřování e-mailové adresy...
        </p>

        <p v-if="successMessage" class="success">
            {{ successMessage }}
        </p>

        <p v-if="errorMessage" class="error">
            {{ errorMessage }}
        </p>

        <NuxtLink v-if="successMessage" to="/login">
            Přejít na přihlášení
        </NuxtLink>
    </article>
</template>
