<template>
	<label class="row spaced">
		<span :style="labelSize ? `flex: ${labelSize};` : ''"><slot></slot></span>
		<input
			:style="[backg, rangeSize ? `flex: ${rangeSize};` : '']"
			type="range"
			v-model="rangeValue"
			:min="min"
			:max="max"
			:dir="dir"
		/>
		<ResetButton v-if="reset != undefined" @click="value = reset ?? 0" />
	</label>
</template>

<script setup lang="ts">
	import ResetButton from "./ResetButton.vue";
	import { computed } from "vue";

	export interface Props {
		labelSize?: number;
		rangeSize?: number;
		dir?: "ltr" | "rtl";
		reset?: number;
		backg?: string;
		min: number;
		max: number;
	}

	const props = defineProps<Props>();
	const value = defineModel<number>({ required: true });
	const backg = computed(() => (props.backg ? `background: ${props.backg};` : ""));
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

		height: 16px;
		min-width: 100px;
		position: relative;
		top: 4px;

		background-color: var(--medium);
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
