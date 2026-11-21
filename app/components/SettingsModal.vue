<script setup>
const emit = defineEmits(['close']);
</script>

<template>
    <div class="popup-window" @click.self="emit('close')">
        <div class="settings-modal">
            <button class="close-btn">  ✕ </button>

            <TwoFactorSetup />
        </div>
    </div>
</template>