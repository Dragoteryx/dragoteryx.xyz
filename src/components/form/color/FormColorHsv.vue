<template>
	<div class="column spaced">
		<FormRange v-model="h" :min="0" :max="360" :backg="hBackg" :label-size="1" :range-size="10">H</FormRange>
		<FormRange v-model="s" :min="0" :max="100" :backg="sBackg" :label-size="1" :range-size="10">S</FormRange>
		<FormRange v-model="v" :min="0" :max="100" :backg="vBackg" :label-size="1" :range-size="10">V</FormRange>
	</div>
</template>

<script setup lang="ts">
	import FormRange from "../FormRange.vue";
	import { useHsv } from "@/composables/color";
	import { Color, Hsv, toColor, toHex, toHsl } from "@/types/color";
	import { computed } from "vue";

	const color = defineModel<Color>({required: true});
	const hsv = useHsv(color);

	const h = computed({
		get: () => hsv.value.h,
		set(h) {
			hsv.value = Hsv.parse({h, s: s.value, v: v.value});
		}
	});

	const s = computed({
		get: () => hsv.value.s,
		set(s) {
			hsv.value = Hsv.parse({h: h.value, s, v: v.value});
		}
	});

	const v = computed({
		get: () => hsv.value.v,
		set(v) {
			hsv.value = Hsv.parse({h: h.value, s: s.value, v});
		}
	});

	const hsl = computed(() => toHsl(color.value));
	const sMin = computed(() => toHex(toColor(Hsv.parse({h: h.value, s: 0, v: v.value}))));
	const sMax = computed(() => toHex(toColor(Hsv.parse({h: h.value, s: 100, v: v.value}))));
	const vMin = computed(() => toHex(toColor(Hsv.parse({h: h.value, s: s.value, v: 0}))));
	const vMax = computed(() => toHex(toColor(Hsv.parse({h: h.value, s: s.value, v: 100}))));
	const hBackg = computed(() => `linear-gradient(in hsl longer hue to right, hsl(0 ${hsl.value.s}% ${hsl.value.l}%), hsl(0 ${hsl.value.s}% ${hsl.value.l}%))`);
	const sBackg = computed(() => `linear-gradient(to right, ${sMin.value}, ${sMax.value})`);
	const vBackg = computed(() => `linear-gradient(to right, ${vMin.value}, ${vMax.value})`);
</script>