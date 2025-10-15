<template>
	<div class="column spaced">
		<FormRange v-model="h" :min="0" :max="360" :backg="hBackg" :label-size="1" :range-size="10">H</FormRange>
		<FormRange v-model="s" :min="0" :max="100" :backg="sBackg" :label-size="1" :range-size="10">S</FormRange>
		<FormRange v-model="l" :min="0" :max="100" :backg="lBackg" :label-size="1" :range-size="10">L</FormRange>
	</div>
</template>

<script setup lang="ts">
	import FormRange from "../FormRange.vue";
	import { useHsl } from "@/composables/color";
	import { type Color, Hsl } from "@/types/color";
	import { computed } from "vue";

	const color = defineModel<Color>({ required: true });
	const hsl = useHsl(color);

	const h = computed({
		get: () => hsl.value.h,
		set(h) {
			hsl.value = new Hsl(h, s.value, l.value);
		},
	});

	const s = computed({
		get: () => hsl.value.s,
		set(s) {
			hsl.value = new Hsl(h.value, s, l.value);
		},
	});

	const l = computed({
		get: () => hsl.value.l,
		set(l) {
			hsl.value = new Hsl(h.value, s.value, l);
		},
	});

	const hBackg = computed(() => {
		const value = `hsl(0 ${s.value}% ${l.value}%)`;
		return `linear-gradient(in hsl longer hue to right, ${value}, ${value})`;
	});

	const sBackg = computed(() => {
		const from = `hsl(${h.value} 0% ${l.value}%)`;
		const to = `hsl(${h.value} 100% ${l.value}%)`;
		return `linear-gradient(to right, ${from}, ${to})`;
	});

	const lBackg = computed(() => {
		const from = `hsl(${h.value} ${s.value}% 0%)`;
		const mid = `hsl(${h.value} ${s.value}% 50%)`;
		const to = `hsl(${h.value} ${s.value}% 100%)`;
		return `linear-gradient(to right, ${from}, ${mid}, ${to})`;
	});
</script>
