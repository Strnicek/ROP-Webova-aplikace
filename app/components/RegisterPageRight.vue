<script setup>

import {ref} from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const passwordAgain = ref('');
const agreeCheckbox = ref(false);

const errorMessage = ref('');
const succesMessage = ref('');
const loading = ref(false);

async function registrace() {
    errorMessage.value = '';
    succesMessage.value = '';

    if(!agreeCheckbox.value) {
        errorMessage.value = "Pro úspěšnou registraci musíte souhlasit s podmínkami";
        return;
    }

    loading.value = true;

    try {
        const response = await $fetch('/api/auth/register', {
            method: 'POST',
            body: {
                username: username.value,
                email: email.value,
                password: password.value,
                passwordConfirm: passwordAgain.value,
            }
        });

        succesMessage.value = response.message;

        username.value = '';
        email.value = '';
        password.value = '';
        passwordAgain.value = '';
        agreeCheckbox.value = false;  
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
                <h2 class="form-headline"> Registrace </h2>
                <p class="form-subtitle"> Vyplňte následující údaje a vytvořte si účet </p>
            </section>
            <form @submit.prevent="registrace">
                <div class="form-input">
                    <label> Uživatelské jméno </label>
                    <input type="text" id="username" placeholder="Zadejte své uživatelské jméno" v-model="username">
                </div>
                <div class="form-input">
                    <label class="form-label"> E-mail </label>
                    <input type="email" id="email" placeholder="Zadejte svůj email" v-model="email">
                </div>

                <div class="form-input">
                    <label class="form-label"> Heslo </label>
                    <input type="password" id="password" placeholder="Zadejte své heslo" v-model="password">
                </div>

                <div class="form-input">
                    <label> Potvrzení hesla </label>
                    <input type="password" id="password-confirm" placeholder="Potvrďte své heslo" v-model="passwordAgain">
                </div>

                <div>
                    <label>
                        <input type="checkbox" v-model="agreeCheckbox">
                        <span> Souhlasím s podmínkami používání a ochranou osobních údajů.  </span>
                    </label>
                </div>

                <p v-if="errorMessage" class="errorMessage"> {{ succesMessage }} </p>
                <p v-if="succesMessage" class="succesMessage"> {{ errorMessage }}</p>

                <button type="submit" class="submit-btn" :disabled="loading">
                    {{ loading ? "Registruji..." : "Registrovat se" }}
                </button>
            </form>
        </article>
</template>