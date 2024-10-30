<template>
	<label class="row spaced">
		<span><slot></slot></span>
		<input class="large" type="range" v-model="value" :min="min" :max="max" :dir="dir" :style="backg">
		<ResetButton v-if="reset != undefined" @click="value = reset ?? 0"/>
	</label>
</template>

<script setup lang="ts">
	import ResetButton from "./ResetButton.vue";
	import { computed } from "vue";

	const value = defineModel({required: true});
	const props = defineProps<{
		dir?: 'ltr' | 'rtl',
		thin?: boolean,
		reset?: number,
		backg?: string,
		min: number,
		max: number,
	}>();

	const backg = computed(() => props.backg ? `background: ${props.backg};` : "");
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
			width: 10px;

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