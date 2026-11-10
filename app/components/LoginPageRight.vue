<script setup>
import {ref} from 'vue';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

async function login() {
    errorMessage.value = '';
    successMessage.value = '';

    if(email.value == null || password.value == null) {
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
    }
    catch(error) {
        errorMessage.value = error.data?.statusMessage || 'Něco se pokazilo.';
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
            <form @submit.prevent="login">
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

                    <a class="forgot-password"> Zapomenuté heslo? </a>
                </div>

                <p v-if="errorMessage" class="errorMessage"> {{ errorMessage }}</p>
                <p v-if="successMessage" class="successMessage">{{ successMessage }}</p>

                <button type="submit" class="submit-btn" :disabled="loading">
                    {{ loading ? 'Přihlašuji...' : 'Přihlásit se' }}
                </button>
            </form>

        </article>
</template>