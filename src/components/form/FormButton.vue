<template>
	<button class="row" @click="emit('click')">
		<component v-if="icon" :is="icon" :size="iconSize ?? 18" absolute-stroke-width />
		<span class="large"><slot></slot></span>
	</button>
</template>

<script setup lang="ts">
	import type { LucideProps } from "lucide-vue-next";
	import type { FunctionalComponent } from "vue";

	export interface Props {
		icon?: FunctionalComponent<LucideProps, {}, any, {}>;
		iconSize?: number;
	}

	export interface Emits {
		click: [];
	}

	const emit = defineEmits<Emits>();
	const props = defineProps<Props>();
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
