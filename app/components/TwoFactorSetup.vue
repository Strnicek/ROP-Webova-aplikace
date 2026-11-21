<script setup>
import { ref } from 'vue';

const qrCode = ref('');
const loading = ref(false);
const errorMessage = ref('');

const verificationCode = ref('');
const verifying = ref(false);
const successMessage = ref('');

async function setupTwoFactor() {
    loading.value = true;
    errorMessage.value = '';

    try {
        const response = await $fetch('/api/2fa/setup', {
            method: 'POST'
        });

        qrCode.value = response.qrCode;
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Nepodařilo se připravit 2FA.';
    }
    finally {
        loading.value = false;
    }
    
}

async function confirmTwoFactor() {
    errorMessage.value = '';
    successMessage.value = '';

    if (!/^\d{6}$/.test(verificationCode.value)) {
        errorMessage.value = 'Zadejte platný šestimístný kód.';
        return;
    }   

    verifying.value = true;

    try {
        const response =  await $fetch('/api/2fa/enable', {
            method: 'POST',
            body: {
                code: verificationCode.value
            }
        });

        successMessage.value = response.message;
        qrCode.value = '';
        verificationCode.value = '';
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Nepodařilo se ověřit kód.';
    }
    finally {
        verifying.value = false;
    }


    
}
</script>

<template>
    <div class="two-factor-container">
        <h2 class="two-factor-headline"> Dvoufázové ověření </h2>

        <p>  
            Zabezpečte svůj účet pomocí Google Authenticator
            nebo jiné autentizační aplikace.
        </p>

        <button v-if="!qrCode" @click="setupTwoFactor" :disabled="loading"> {{ loading ? 'Načítání...' : 'Zapnout 2FA' }} </button>

        <div v-if="qrCode">
            <p>Naskenujte tento QR kód v autentizační aplikaci:</p>
            <img :src="qrCode" alt="QR kód pro nastavení 2FA">
            <p>
                Po naskenování zadáte šestimístný kód,
                kterým aktivaci potvrdíte.
            </p>

            <form class="two-factor-form" @submit.prevent="confirmTwoFactor">
                <label for="verification-code"> Ověřovací kód </label>
                <input 
                    id="verification-code"
                    v-model="verificationCode"
                    type="text"
                    inputmode="numeric"
                    maxlength="6"
                    autocomplete="one-time-code"
                    placeholder="Zadejte 6místný kód"
                >

                <button type="submit" :disabled="verifying"> {{ verifying ? 'Ověřování...' : 'Potvrdit kód' }} </button>
            </form>
        </div>

         <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </p>

    </div>
</template>