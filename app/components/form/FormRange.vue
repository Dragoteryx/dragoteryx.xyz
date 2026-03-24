<template>
	<label class="flex flex-row gap-2">
		<span class="min-w-4"><slot></slot></span>
		<input type="range" class="flex-1" v-model="rangeValue" :min="min" :max="max" :dir="dir" :style="{ background }" />
		<ResetButton v-if="reset != undefined" @click="value = reset ?? 0" />
	</label>
</template>

<script setup lang="ts">
	export interface Props {
		background?: string;
		dir?: "ltr" | "rtl";
		reset?: number;
		min: number;
		max: number;
	}

	const props = defineProps<Props>();
	const value = defineModel<number>({ required: true });
	const rangeValue = computed({
		get: () => value.value,
		set(num) {
			value.value = Number(num);
		},
	});
</script>

<style scoped lang="scss">
	input[type="range"] {
		appearance: none;
		outline: none;

		height: 1rem;
		min-width: 1rem;
		position: relative;
		top: 0.25rem;

		background-color: var(--medium);
		border: 1px solid var(--dark);

		@mixin slider-thumb {
			cursor: pointer;
			appearance: none;

			height: 1.5rem;
			width: 0.75rem;

			background-color: var(--light);
			border: 1px solid var(--dark);
		}

		&::-webkit-slider-thumb {
			@include slider-thumb;
		}

		&::-moz-range-thumb {
			@include slider-thumb;
		}
	}
</style>
