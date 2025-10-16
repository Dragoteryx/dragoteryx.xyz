<template>
	<div class="column spaced">
		<FormRange v-model="h" :min="0" :max="360" :backg="hBackg" :label-size="1" :range-size="10">H</FormRange>
		<FormRange v-model="s" :min="0" :max="100" :backg="sBackg" :label-size="1" :range-size="10">S</FormRange>
		<FormRange v-model="v" :min="0" :max="100" :backg="vBackg" :label-size="1" :range-size="10">V</FormRange>
	</div>
</template>

<script setup lang="ts">
	import FormRange from "../FormRange.vue";
	import { useHsl, useHsv } from "@/composables/color";
	import { type Color, Hsv } from "@/types/color";
	import { computed } from "vue";

	const color = defineModel<Color>({ required: true });
	const hsv = useHsv(color);

	const h = computed({
		get: () => hsv.value.h,
		set(h) {
			hsv.value = new Hsv(h, s.value, v.value);
		},
	});

	const s = computed({
		get: () => hsv.value.s,
		set(s) {
			hsv.value = new Hsv(h.value, s, v.value);
		},
	});

	const v = computed({
		get: () => hsv.value.v,
		set(v) {
			hsv.value = new Hsv(h.value, s.value, v);
		},
	});

	const hsl = useHsl(color);
	const hBackg = computed(() => {
		const value = `hsl(0 ${hsl.value.s}% ${hsl.value.l}%)`;
		return `linear-gradient(in hsl longer hue to right, ${value}, ${value})`;
	});

	const sBackg = computed(() => {
		const from = new Hsv(h.value, 0, v.value).hex;
		const to = new Hsv(h.value, 100, v.value).hex;
		return `linear-gradient(to right, ${from}, ${to})`;
	});

	const vBackg = computed(() => {
		const from = new Hsv(h.value, s.value, 0).hex;
		const to = new Hsv(h.value, s.value, 100).hex;
		return `linear-gradient(to right, ${from}, ${to})`;
	});
</script>
