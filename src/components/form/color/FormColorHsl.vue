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

	const color = defineModel<Color>({required: true});
	const hsl = useHsl(color);

	const h = computed({
		get: () => hsl.value.h,
		set(h) {
			hsl.value = Hsl.parse({h, s: s.value, l: l.value});
		}
	});

	const s = computed({
		get: () => hsl.value.s,
		set(s) {
			hsl.value = Hsl.parse({h: h.value, s, l: l.value});
		}
	});

	const l = computed({
		get: () => hsl.value.l,
		set(l) {
			hsl.value = Hsl.parse({h: h.value, s: s.value, l});
		}
	});

	const hBackg = computed(() => `linear-gradient(in hsl longer hue to right, hsl(0 ${s.value}% ${l.value}%), hsl(0 ${s.value}% ${l.value}%))`);
	const sBackg = computed(() => `linear-gradient(to right, hsl(${h.value} 0% ${l.value}%), hsl(${h.value} 100% ${l.value}%))`);
	const lBackg = computed(() => `linear-gradient(to right, hsl(${h.value} ${s.value}% 0%), hsl(${h.value} ${s.value}% 50%), hsl(${h.value} ${s.value}% 100%))`);
</script>