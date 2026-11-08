<script setup>
</script>

<template>

    <header>
    <div>
        <h1 class="nazev-App"> Study<span class="flow">Flow</span></h1>
    </div>
    <nav>
        <p class="nav-link"> O Aplikaci </p>
        <p class="nav-link"> Funkce </p>
        <p class="nav-link"> Kontakt </p>
    </nav>
    <div class="buttons-flex">
        <NuxtLink to="/login" class="login-btn"> Přihlásit se </NuxtLink>
        <NuxtLink to="/register" class="register-btn"> Registrace </NuxtLink>
    </div>
</header>


</template>