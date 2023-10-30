<template>
	<button class="row" @click="emit('click')">
		<span v-if="icon" :class="{ pi: true, 'pi-spin': spin, [icon]: true }"></span>
		<span v-if="text" class="large">{{ text }}</span>
	</button>
</template>

<script setup lang="ts">
	const emit = defineEmits<{click: []}>();
	
	defineProps<{
		text?: string;
		icon?: string;
		spin?: boolean;
	}>();
</script>

<style scoped lang="scss">;
	@use "@/styles/mixins.scss";

	button {
		padding: 5px;

		font-size: 1rem;
		color: var(--white);

		text-align: center;
		text-decoration: none;

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