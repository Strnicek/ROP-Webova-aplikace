<script setup>
import DashboardPageSidebar from '~/components/DashboardPageSidebar.vue';
import DashboardPageHeader from '~/components/DashboardPageHeader.vue';

definePageMeta({
    middleware: 'auth'
});
</script>

<template>
    <div class="dashboard">
        <DashboardPageSidebar />

        <main class="dashboard-content tests-page-content">
            <DashboardPageHeader title="Historie vyplněných testů" />

            <section class="tests-container">
                <div class="tests-filter">
                    <select>
                        <option> Všechny předměty </option>
                    </select>
                </div>

                <div class="tests-empty">
                    <p> Zatím jste nevyplnili žádné testy! </p>
                </div>
            </section>
        </main>

    </div>
</template>