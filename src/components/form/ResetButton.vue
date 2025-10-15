<template>
	<FormButton icon="replay" @click="emit('click')" />
</template>

<script setup lang="ts">
	import FormButton from "./FormButton.vue";

	export interface Emits {
		click: [];
	}

	const emit = defineEmits<Emits>();
</script>

<style scoped>
	button {
		font-size: 12px;
		height: 24px;
	}
</style>
