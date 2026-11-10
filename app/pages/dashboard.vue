<script setup lang="ts">
import DashboardPageSidebar from '~/components/DashboardPageSidebar.vue';

definePageMeta ({
    middleware: 'auth'
})

</script>

<template>
    <DashboardPageSidebar />
</template>