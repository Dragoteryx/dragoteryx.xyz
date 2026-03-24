<template>
	<button class="flex flex-row p-1" @click="emit('click')">
		<Icon v-if="icon" :name="icon" :size="iconSize ?? '1.25rem'" :aria-label="label" />
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
		color: var(--white);

		line-height: normal;
		text-align: center;
		text-decoration: none;
		outline: none;

		background: var(--medium);
		border: 1px solid var(--dark);

		transition-property: background-color, color;
		transition-duration: 0.2s, 0.2s;

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
