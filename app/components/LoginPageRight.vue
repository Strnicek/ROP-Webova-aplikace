<script setup>
import {ref} from 'vue';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

const user = useState('auth-user');

const requiresTwoFactor = ref(false);
const verificationCode = ref('');

async function login() {
    errorMessage.value = '';
    successMessage.value = '';

    if(!email.value || !password.value) {
        errorMessage.value = 'Nebyli vyplněny všechny přihlašovací údaje';
        return;
    }

    loading.value = true;

    try{
        const response = await $fetch('/api/auth/login', {
            method: 'POST',
            body: {
                email: email.value,
                password: password.value,
                rememberMe: rememberMe.value
            }
        });

        successMessage.value = response.message;

        if(response.requiresTwoFactor) {
            requiresTwoFactor.value = true;
            password.value = '';
            return;
        }

        const responseUser = await $fetch('/api/auth/me');

        user.value = responseUser.user;

        await navigateTo('/dashboard');
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Něco se pokazilo.';
    }
    finally {
        loading.value = false;
    }
}

async function verifyTwoFactor() {
    errorMessage.value = '';
    successMessage.value = '';

    if (!/^\d{6}$/.test(verificationCode.value)) {
        errorMessage.value = 'Zadejte platný šestimístný kód.';
        return;
    }

    loading.value = true;

    try {
        const response = await $fetch('/api/auth/verify-2fa', {
            method: 'POST',
            body: {
                code: verificationCode.value
            }
        });

        successMessage.value = response.message;

        const responseUser = await $fetch('/api/auth/me');

        user.value = responseUser.user;

        verificationCode.value = '';

        await navigateTo('/dashboard');
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Nepodařilo se ověřit kód.';
    }
    finally {
        loading.value = false;
    }
}
</script>

<template>
        <article class="form-box">
            <section class="form-top">
                <h2 class="form-headline"> Přihlášení </h2>
                <p class="form-subtitle"> Zadejte své údaje a pokračujte </p>
            </section>
            <form v-if="!requiresTwoFactor" @submit.prevent="login">
                <div class="form-input">
                    <label class="form-label"> E-mail </label>
                    <input type="email" id="email" placeholder="Zadejte svůj email" v-model="email">
                </div>

                <div class="form-input">
                    <label class="form-label"> Heslo </label>
                    <input type="password" id="password" placeholder="Zadejte své heslo" v-model="password">
                </div>

                <div class="form-options">
                    <label class="checkbox"> 
                        <input type="checkbox" v-model="rememberMe">
                        Zapamatovat přihlášení
                    </label>

                    <NuxtLink to="/forgot-password" class="forgot-password"> Zapomenuté heslo? </NuxtLink>
                </div>

                <p v-if="errorMessage" class="errorMessage"> {{ errorMessage }}</p>
                <p v-if="successMessage" class="successMessage">{{ successMessage }}</p>

                <button type="submit" class="submit-btn" :disabled="loading">
                    {{ loading ? 'Přihlašuji...' : 'Přihlásit se' }}
                </button>
            </form>

            <div v-if="requiresTwoFactor" class="twoFactor-form">
                <p>
                    Na váš e-mail jsme odeslali šestimístný
                    ověřovací kód. Zadejte ho níže.
                </p>

                <div class="form-input">
                    <label class="form-label" for="verification-code"> Ověřovací kód </label>

                    <input
                        id="verification-code"
                        type="text"
                        v-model="verificationCode"
                        inputmode="numeric"
                        maxlength="6"
                        autocomplete="one-time-code"
                        placeholder="Zadejte 6 místný kód"
                    >
                </div>

              

                 <p v-if="errorMessage" class="errorMessage">
                    {{ errorMessage }}
                 </p>

                 <p v-if="successMessage" class="successMessage">
                    {{ successMessage }}
                 </p>

                   <button
                    type="button"
                    class="submit-btn"
                    @click="verifyTwoFactor"
                    :disabled="loading"
                >
                    {{ loading ? 'Ověřuji...' : 'Ověřit kód' }}
                </button>

                 <button type="button" class="submit-btn" @click="requiresTwoFactor = false"> Zpět na přihlášení </button>
            </div>

        </article>
</template>