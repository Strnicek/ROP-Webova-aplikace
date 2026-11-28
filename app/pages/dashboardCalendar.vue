<script setup>
import DashboardPageSidebar from '~/components/DashboardPageSidebar.vue';
import DashboardPageHeader from '~/components/DashboardPageHeader.vue';
import DashboardPageCalendar from '~/components/DashboardPageCalendar.vue';

definePageMeta({
    middleware: 'auth'
});
</script>

<template>
    <div class="dashboard">

        <DashboardPageSidebar />

        <main class="dashboard-content">
            <DashboardPageHeader title="Kalednář" />

            <DashboardPageCalendar />
        </main>
    </div>
</template>