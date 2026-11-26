<script setup>
import DashboardPageSidebar from '~/components/DashboardPageSidebar.vue';
import DashboardPageHeader from '~/components/DashboardPageHeader.vue';
import DashboardStatisticsCards from '~/components/DashboardPageStats.vue';

definePageMeta({
    middleware: 'auth'
});
</script>

<template>
    <div class="dashboard"> 
        <DashboardPageSidebar />

        <main class="dashboard-content">
            <DashboardPageHeader title="Statistiky vašeho učení" />
            <DashboardPageStats />
        </main>
    </div>

</template>