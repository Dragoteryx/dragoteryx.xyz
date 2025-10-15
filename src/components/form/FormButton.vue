<template>
	<button class="row" @click="emit('click')">
		<span v-if="icon" :class="{ pi: true, [icon]: true }"></span>
		<span class="large"><slot></slot></span>
	</button>
</template>

<script setup lang="ts">
	const emit = defineEmits<{ click: [] }>();

	defineProps<{
		text?: string;
		icon?: string;
	}>();
</script>

<style scoped lang="scss">
	@use "@/styles/mixins.scss";

	button {
		padding: 5px;

		font-size: 1rem;
		color: var(--white);

		text-align: center;
		text-decoration: none;
		outline: none;

		background: var(--medium);
		border: 1px solid var(--dark);

		transition-property: background-color;
		transition-duration: 0.2s;

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
