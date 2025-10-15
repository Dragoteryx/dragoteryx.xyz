<template>
	<input type="text" v-model="text" :disabled="disabled" />
</template>

<script setup lang="ts">
	export interface Props {
		disabled?: boolean;
	}

	const text = defineModel<string>({ required: true });
	const props = defineProps<Props>();
</script>

<style scoped lang="scss">
	input[type="text"] {
		border: 1px solid var(--dark);
		background: var(--background-center);
		color: var(--text);
		padding: 5px;
		outline: none;
	}
</style>
