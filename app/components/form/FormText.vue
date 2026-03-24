<template>
	<input type="text" class="p-1" v-model="text" v-bind="props" @keydown.enter="emit('submit', text)" />
</template>

<script setup lang="ts">
	export interface Props {
		placeholder?: string;
		disabled?: boolean;
	}

	export interface Emits {
		submit: [value: string];
	}

	const props = defineProps<Props>();
	const emit = defineEmits<Emits>();
	const text = defineModel<string>({ required: true });
</script>

<style scoped lang="scss">
	input[type="text"] {
		border: 1px solid var(--dark);
		background: var(--background-center);
		color: var(--text);
		outline: none;

		&::placeholder {
			color: var(--dark);
		}
	}
</style>
