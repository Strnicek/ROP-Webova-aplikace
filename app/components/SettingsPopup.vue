<script setup>
import {ref} from 'vue';

const emit = defineEmits(['close']);

const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const statusLoading = ref(true);
const twoFactorEnabled = ref(false);

async function TwoFactorStatus() {
    statusLoading.value = true;
    
    try{
        const response = await $fetch('/api/auth/status-email-2fa');
        twoFactorEnabled.value = response.enabled;
    }
    catch(error) {
        errorMessage.value = 'Nepodařilo se načíst stav dvoufázového ověřování.';
    }
    finally {
        statusLoading.value = false;
    }
}

async function switchTwoFactor() {

    errorMessage.value = '';
    successMessage.value = '';

    if(!password.value) {
        errorMessage.value = 'Zadejte své heslo.';
        return;
    }

    loading.value = true;

    try {
        const url = twoFactorEnabled.value ? '/api/auth/delete-email-2fa' : '/api/auth/enable-email-2fa';

        const response = await $fetch(url, {
            method: 'POST',
            body: {
                password: password.value
            }
        });

        successMessage.value = response.message;
        password.value = '';

        twoFactorEnabled.value = !twoFactorEnabled.value;
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Nepodařilo se zapnout ověřování.';
    }
    finally {
        loading.value = false;
    }
    
}

onMounted(() => {
    TwoFactorStatus();
});
</script>

<template>
    <div class="setting-window" @click.self="emit('close')">
        <div class="settings-inside">
            <button type="button" class="close-btn" @click="emit('close')">  ✕ </button>

            <h2> Nastavení účtu </h2>

            <div class="settings-inside-flex">
                <h3> Dvoufázové ověření </h3>

                <p>
                    Při přihlašování bude na váš e-mail zaslán
                    šestimístný ověřovací kód.
                </p>

                <p v-if="!statusLoading"> Stav: <strong> {{twoFactorEnabled ? 'Zapnuto' : 'Vypnuto'}}</strong></p>
            </div>

            <p v-if="statusLoading"> Načítám nastavení...</p>

            <form v-else class="settings-form" @submit.prevent="switchTwoFactor">
                <label for="two-factor-password"> Potvrďte své heslo: </label>

                <input
                    id="two-factor-password"
                    type="password"
                    v-model="password"
                    placeholder="Zadejte své heslo"
                    required
                >

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <p v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </p>

                <button type="submit" :disabled="loading" class="two-factor-btn">
                    {{ loading ? 'Ukládám' : twoFactorEnabled ? 'Vypnout 2FA' : 'Zapnout 2FA' }}
                </button>
            </form>
        </div>

    </div>
</template>