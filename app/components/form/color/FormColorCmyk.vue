<template>
	<div class="flex flex-col gap-1">
		<FormRange v-model="c" :min="0" :max="100" :background="cBackg">C</FormRange>
		<FormRange v-model="m" :min="0" :max="100" :background="mBackg">M</FormRange>
		<FormRange v-model="y" :min="0" :max="100" :background="yBackg">Y</FormRange>
		<FormRange v-model="k" :min="0" :max="100" :background="kBackg">K</FormRange>
	</div>
</template>

<script setup lang="ts">
	const color = defineModel<Color>({ required: true });
	const cmyk = useCmyk(color);

	const c = computed({
		get: () => cmyk.value.c,
		set(value) {
			cmyk.value = new Cmyk(value, m.value, y.value, k.value);
		},
	});

	const m = computed({
		get: () => cmyk.value.m,
		set(value) {
			cmyk.value = new Cmyk(c.value, value, y.value, k.value);
		},
	});

	const y = computed({
		get: () => cmyk.value.y,
		set(value) {
			cmyk.value = new Cmyk(c.value, m.value, value, k.value);
		},
	});

	const k = computed({
		get: () => cmyk.value.k,
		set(value) {
			cmyk.value = new Cmyk(c.value, m.value, y.value, value);
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
