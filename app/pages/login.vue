<script setup lang="ts">
import LoginPageLeft from '~/components/LoginPageLeft.vue';
import LoginPageRight from '~/components/LoginPageRight.vue';

</script>

<template>
    <LandingPageHeader />

    <article class="login-flex">
        <LoginPageLeft />
        <LoginPageRight />
    </article>
    
</template>