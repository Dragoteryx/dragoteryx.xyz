<template>
	<FormButton icon="pi-replay" @click="emit('click')"/>
</template>

<script setup lang="ts">
	import FormButton from "./FormButton.vue";

	const emit = defineEmits<{click: []}>();
</script>

<style scoped>
	button {
		font-size: 12px;
		height: 24px;
	}
</style>