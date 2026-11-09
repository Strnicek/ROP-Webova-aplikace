<template>
    <header>
    <div>
        <h1 class="nazev-App"> Study<span class="flow">Flow</span></h1>
    </div>

    <button class="hamburger" @click="toggleMenu" :class="{'is-active' : isMenuOpen}">
        <span class="span1"></span>
        <span class="span2"></span>
        <span class="span3"></span>
    </button>

    <div class="hamburger-menu" :class="{'open' : isMenuOpen}">
        <h2 class="hamburger-name"> Study<span class="flow">Flow</span> </h2>
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
import {ref, watch, onBeforeUnmount} from 'vue'

const isMenuOpen = ref(false)
let previous = ''

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
}

const closeMenu = () => {
    isMenuOpen.value = false;
}

watch(isMenuOpen, (isOpen) => {
    if(isOpen) {
        previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
    }
    else {
        document.body.style.overflow = previous
    }
})

onBeforeUnmount(() => {
    document.body.style.overflow = previous
})


</script>