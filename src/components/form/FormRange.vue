<template>
	<label class="row spaced">
		<span><slot></slot></span>
		<input class="large" type="range" v-model="value" :min="min" :max="max">
		<ResetButton v-if="reset != undefined" @click="value = reset"/>
	</label>
</template>

<script setup lang="ts">
	import ResetButton from "./ResetButton.vue";
	import { computed } from "vue";

	const props = defineProps<{
		modelValue?: number,
		reset?: number,
		min?: number,
		max?: number,
	}>();

	const emits = defineEmits<{
		"update:modelValue": [value: number]
	}>();

  const value = computed({
		get: () => props.modelValue ?? 0,
		set(value: string | number) {
			emits("update:modelValue", Number(value));
		}
	});
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