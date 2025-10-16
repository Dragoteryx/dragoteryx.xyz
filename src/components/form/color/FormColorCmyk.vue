<template>
	<div class="column spaced">
		<FormRange v-model="c" :min="0" :max="100" :backg="cBackg" :label-size="1" :range-size="10">C</FormRange>
		<FormRange v-model="m" :min="0" :max="100" :backg="mBackg" :label-size="1" :range-size="10">M</FormRange>
		<FormRange v-model="y" :min="0" :max="100" :backg="yBackg" :label-size="1" :range-size="10">Y</FormRange>
		<FormRange v-model="k" :min="0" :max="100" :backg="kBackg" :label-size="1" :range-size="10">K</FormRange>
	</div>
</template>

<script setup lang="ts">
	import FormRange from "../FormRange.vue";
	import { useCmyk } from "@/composables/color";
	import { type Color, Cmyk } from "@/types/color";
	import { computed } from "vue";

	const color = defineModel<Color>({ required: true });
	const cmyk = useCmyk(color);

	const c = computed({
		get: () => cmyk.value.c,
		set(value) {
			cmyk.value = new Cmyk(value, cmyk.value.m, cmyk.value.y, cmyk.value.k);
		},
	});

	const m = computed({
		get: () => cmyk.value.m,
		set(value) {
			cmyk.value = new Cmyk(cmyk.value.c, value, cmyk.value.y, cmyk.value.k);
		},
	});

	const y = computed({
		get: () => cmyk.value.y,
		set(value) {
			cmyk.value = new Cmyk(cmyk.value.c, cmyk.value.m, value, cmyk.value.k);
		},
	});

	const k = computed({
		get: () => cmyk.value.k,
		set(value) {
			cmyk.value = new Cmyk(cmyk.value.c, cmyk.value.m, cmyk.value.y, value);
		},
	});

	const cBackg = computed(() => {
		const from = new Cmyk(0, m.value, y.value, k.value).hex;
		const to = new Cmyk(100, m.value, y.value, k.value).hex;
		return `linear-gradient(to right, ${from}, ${to})`;
	});

	const mBackg = computed(() => {
		const from = new Cmyk(c.value, 0, y.value, k.value).hex;
		const to = new Cmyk(c.value, 100, y.value, k.value).hex;
		return `linear-gradient(to right, ${from}, ${to})`;
	});

	const yBackg = computed(() => {
		const from = new Cmyk(c.value, m.value, 0, k.value).hex;
		const to = new Cmyk(c.value, m.value, 100, k.value).hex;
		return `linear-gradient(to right, ${from}, ${to})`;
	});

	const kBackg = computed(() => {
		const from = new Cmyk(c.value, m.value, y.value, 0).hex;
		const to = new Cmyk(c.value, m.value, y.value, 100).hex;
		return `linear-gradient(to right, ${from}, ${to})`;
	});
</script>
