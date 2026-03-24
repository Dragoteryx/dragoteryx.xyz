<template>
	<button class="row" @click="emit('click')">
		<Icon v-if="icon" :name="icon" :size="iconSize ?? 18" mode="svg" />
		<span class="large"><slot></slot></span>
	</button>
</template>

<script setup lang="ts">
	export interface Props {
		icon?: string;
		iconSize?: number;
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
		padding: 5px;

		font-size: 1rem;
		color: var(--white);

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
