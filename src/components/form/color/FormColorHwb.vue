<template>
	<div class="column spaced">
		<FormRange v-model="h" :min="0" :max="360" :backg="hBackg">H</FormRange>
		<FormRange v-model="w" :min="0" :max="100 - b" :backg="wBackg">W</FormRange>
		<FormRange v-model="b" :min="0" :max="100 - w" :backg="bBackg">B</FormRange>
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
			hwb.value = Hwb.parse({h: Number(h), w: w.value, b: b.value});
		}
	});

	const w = computed({
		get: () => hwb.value.w,
		set(w) {
			hwb.value = Hwb.parse({h: h.value, w: Number(w), b: b.value});
		}
	});

	const b = computed({
		get: () => hwb.value.b,
		set(b) {
			hwb.value = Hwb.parse({h: h.value, w: w.value, b: Number(b)});
		}
	});

	const hBackg = computed(() => `linear-gradient(in hwb longer hue to right, hwb(0 ${w.value}% ${b.value}%), hwb(0 ${w.value}% ${b.value}%))`);
	const wBackg = computed(() => `linear-gradient(to right, hwb(${h.value} 0% ${b.value}%), hwb(${h.value} ${100 - b.value} ${b.value}%))`);
	const bBackg = computed(() => `linear-gradient(to right, hwb(${h.value} ${w.value}% 0%), hwb(${h.value} ${w.value}% ${100 - w.value}%))`);
</script>