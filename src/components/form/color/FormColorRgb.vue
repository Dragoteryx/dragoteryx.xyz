<template>
	<div class="column spaced">
		<FormRange v-model="r" :min="0" :max="255" :backg="rBackg" :label-size="1" :range-size="10">R</FormRange>
		<FormRange v-model="g" :min="0" :max="255" :backg="gBackg" :label-size="1" :range-size="10">G</FormRange>
		<FormRange v-model="b" :min="0" :max="255" :backg="bBackg" :label-size="1" :range-size="10">B</FormRange>
	</div>
</template>

<script setup lang="ts">
	import FormRange from "../FormRange.vue";
	import { useRgb } from "@/composables/color";
	import { type Color, Rgb } from "@/types/color";
	import { computed } from "vue";

	const color = defineModel<Color>({required: true});
	const rgb = useRgb(color);

	const r = computed({
		get: () => rgb.value.r,
		set(r) {
			rgb.value = new Rgb(r, g.value, b.value);
		}
	});

	const g = computed({
		get: () => rgb.value.g,
		set(g) {
			rgb.value = new Rgb(r.value, g, b.value);
		}
	});

	const b = computed({
		get: () => rgb.value.b,
		set(b) {
			rgb.value = new Rgb(r.value, g.value, b);
		}
	});

	const rBackg = computed(() => `linear-gradient(to right, rgb(0 ${g.value} ${b.value}), rgb(255 ${g.value} ${b.value}))`);
	const gBackg = computed(() => `linear-gradient(to right, rgb(${r.value} 0 ${b.value}), rgb(${r.value} 255 ${b.value}))`);
	const bBackg = computed(() => `linear-gradient(to right, rgb(${r.value} ${g.value} 0), rgb(${r.value} ${g.value} 255))`);
</script>