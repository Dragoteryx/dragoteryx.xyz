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

	const color = defineModel<Color>({required: true});
	const hwb = useHwb(color);

	const h = computed({
		get: () => hwb.value.h,
		set(h) {
			hwb.value = Hwb.parse({h, w: w.value, b: b.value});
		}
	});

	const w = computed({
		get: () => hwb.value.w,
		set(w) {
			if (w + b.value > 100) {
				hwb.value = Hwb.parse({h: h.value, w, b: 100 - w});
			} else {
				hwb.value = Hwb.parse({h: h.value, w, b: b.value});
			}
		}
	});

	const b = computed({
		get: () => hwb.value.b,
		set(b) {
			if (w.value + b > 100) {
				hwb.value = Hwb.parse({h: h.value, w: 100 - b, b});
			} else {
				hwb.value = Hwb.parse({h: h.value, w: w.value, b});
			}
		}
	});

	const hBackg = computed(() => `linear-gradient(in hwb longer hue to right, hwb(0 ${w.value}% ${b.value}%), hwb(0 ${w.value}% ${b.value}%))`);
	const wBackg = computed(() => `linear-gradient(to right, hwb(${h.value} 0% ${b.value}%), hwb(${h.value} 100% 0%))`);
	const bBackg = computed(() => `linear-gradient(to right, hwb(${h.value} ${w.value}% 0%), hwb(${h.value} 0% 100%))`);
</script>