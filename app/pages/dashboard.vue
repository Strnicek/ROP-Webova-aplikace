<script setup lang="ts">
import DashboardPageSidebar from '~/components/DashboardPageSidebar.vue';
import DashboardPageHeader from '~/components/DashboardPageHeader.vue';
import DashboardPageEmpty from '~/components/DashboardPageEmpty.vue';

definePageMeta ({
    middleware: 'auth'
})

</script>

<template>
    <div class="dashboard">
        <DashboardPageSidebar />

        <main class="dashboard-content">
            <DashboardPageHeader title="Předměty" />

            <section class="dashboard-empty">
                  <DashboardPageEmpty
                    message="Zatím zde nemáte vytvořený žádný předmět"
                    button-text="Vytvořit nový předmět"
                    />
            </section>
            
        </main>

    </div>
    
</template>