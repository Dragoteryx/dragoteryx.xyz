<template>
	<label class="row spaced">
		<span><slot></slot></span>
		<input class="large" type="range" v-model="value" :min="min" :max="max" :dir="rightToLeft ? 'rtl' : 'ltr'">
		<ResetButton v-if="reset != undefined" @click="value = reset ?? 0"/>
	</label>
</template>

<script setup lang="ts">
	import ResetButton from "./ResetButton.vue";

	const value = defineModel<number>({ default: 0 });
	defineProps<{
		rightToLeft?: boolean,
		reset?: number,
		min: number,
		max: number,
	}>();
</script>

<style scoped lang="scss">
	input[type=range] {
		appearance: none;

		height: 16px;
		min-width: 100px;
		position: relative;
		top: 4px;

		background-color: var(--medium);;
		border: 1px solid var(--dark);

		@mixin slider-thumb {
			cursor: pointer;
			appearance: none;

			height: 20px;
			width: 20px;

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