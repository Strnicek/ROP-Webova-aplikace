<script setup>

defineProps({
    message: String,
    buttonText: String
});

const emit = defineEmits(['create']);

</script>

<template>

    <div class="empty-state">

        <p class="empty-text">{{ message }}</p>

        <button @click="emit('create')">
            + {{ buttonText }}
        </button>

    </div>

</template>
