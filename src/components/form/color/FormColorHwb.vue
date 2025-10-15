<template>
	<div class="column spaced">
		<FormRange v-model="h" :min="0" :max="360" :backg="hBackg" :label-size="1" :range-size="10">H</FormRange>
		<FormRange v-model="w" :min="0" :max="100" :backg="wBackg" :label-size="1" :range-size="10">W</FormRange>
		<FormRange v-model="b" :min="0" :max="100" :backg="bBackg" :label-size="1" :range-size="10">B</FormRange>
	</div>
</template>

<script setup lang="ts">
	import FormRange from "../FormRange.vue";
	import { useHwb } from "@/composables/color";
	import { type Color, Hwb } from "@/types/color";
	import { computed } from "vue";

	const color = defineModel<Color>({ required: true });
	const hwb = useHwb(color);

	const h = computed({
		get: () => hwb.value.h,
		set(h) {
			hwb.value = new Hwb(h, w.value, b.value);
		},
	});

	const w = computed({
		get: () => hwb.value.w,
		set(w) {
			if (w + b.value > 100) {
				hwb.value = new Hwb(h.value, w, 100 - w);
			} else {
				hwb.value = new Hwb(h.value, w, b.value);
			}
		},
	});

	const b = computed({
		get: () => hwb.value.b,
		set(b) {
			if (w.value + b > 100) {
				hwb.value = new Hwb(h.value, 100 - b, b);
			} else {
				hwb.value = new Hwb(h.value, w.value, b);
			}
		},
	});

	const hBackg = computed(() => {
		const value = `hwb(360 ${w.value}% ${b.value}%)`;
		return `linear-gradient(in hwb longer hue to right, ${value}, ${value})`;
	});

	const wBackg = computed(() => {
		const from = `hwb(${h.value} 0% ${b.value}%)`;
		const to = `hwb(${h.value} 100% 0%)`;
		return `linear-gradient(to right, ${from}, ${to})`;
	});

	const bBackg = computed(() => {
		const from = `hwb(${h.value} ${w.value}% 0%)`;
		const to = `hwb(${h.value} 0% 100%)`;
		return `linear-gradient(to right, ${from}, ${to})`;
	});
</script>
