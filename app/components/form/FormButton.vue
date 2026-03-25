<template>
	<button class="flex flex-row p-1" :aria-label="label" @click="emit('click')">
		<Icon v-if="icon" :name="icon" :size="iconSize ?? '1.25rem'" />
		<span class="flex-1"><slot></slot></span>
	</button>
</template>

<script setup lang="ts">
	export interface Props {
		iconSize?: string | number;
		icon?: string;
		label?: string;
	}

	export interface Emits {
		click: [];
	}

	const emit = defineEmits<Emits>();
	const props = defineProps<Props>();
</script>

<style scoped lang="scss">
	@use "@/assets/styles/mixins.scss";

	button {
		line-height: normal;
		text-align: center;
		text-decoration: none;
		outline: none;

		color: var(--white);
		background: var(--medium);
		border: 1px solid var(--dark);
		transition:
			background-color 0.2s ease,
			color 0.2s ease;

		&:disabled {
			color: var(--dark);
		}

		&:hover:not(:disabled) {
			@include mixins.colored;

			background: var(--light);
			cursor: pointer;
		}
	}
</style>
