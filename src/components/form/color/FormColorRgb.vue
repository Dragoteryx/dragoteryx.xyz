<template>
	<div class="column spaced">
		<FormRange v-model="r" :min="0" :max="255" backg="linear-gradient(to right, black, red)">R</FormRange>
		<FormRange v-model="g" :min="0" :max="255" backg="linear-gradient(to right, black, green)">G</FormRange>
		<FormRange v-model="b" :min="0" :max="255" backg="linear-gradient(to right, black, blue)">B</FormRange>
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
			rgb.value = Rgb.parse({r: Number(r), g: g.value, b: b.value});
		}
	});

	const g = computed({
		get: () => rgb.value.g,
		set(g) {
			rgb.value = Rgb.parse({r: r.value, g: Number(g), b: b.value});
		}
	});

	const b = computed({
		get: () => rgb.value.b,
		set(b) {
			rgb.value = Rgb.parse({r: r.value, g: g.value, b: Number(b)});
		}
	});
</script>