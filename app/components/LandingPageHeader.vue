<template>
    <header>
    <div>
        <h1 class="nazev-App"> Study<span class="flow">Flow</span></h1>
    </div>

    <button class="hamburger" @click="toggleMenu" :class="{'is-active' : isMenuOpen}">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <div class="hamburger-menu" :class="{'open' : isMenuOpen}">
        <nav>
            <p class="nav-link"> O Aplikaci </p>
            <p class="nav-link"> Funkce </p>
            <p class="nav-link"> Kontakt </p>
        </nav>
        <div class="buttons-flex">
            <NuxtLink to="/login" class="login-btn"> Přihlásit se </NuxtLink>
            <NuxtLink to="/register" class="register-btn"> Registrace </NuxtLink>
        </div>
    </div>
</header>
</template>

<script setup>
import {ref} from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
}

const closeMenu = () => {
    isMenuOpen.value = false;
}
</script>