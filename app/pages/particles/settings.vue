<template>
	<div class="flex flex-col gap-2">
		<span><b>Gravity settings</b></span>
		<FormRange v-model="sandboxStore.gravity.strength" :min="0" :max="9810" :reset="981">Strength</FormRange>
		<FormRange v-model="sandboxStore.gravity.angle" dir="rtl" :min="-180" :max="180" :reset="0">Angle</FormRange>
		<hr />
		<span>Color picker</span>
		<FormSelect v-model="sandboxStore.options.colorPicker" :options="colorPickers" />
	</div>
</template>

<script setup lang="ts">
	useHead({ title: "Sandbox/Settings" });

	const sandboxStore = useParticlesStore();
	const colorPickers = [
		{ value: "rgb", description: "RGB" },
		{ value: "hsl", description: "HSL" },
		{ value: "hsv", description: "HSV" },
		{ value: "hwb", description: "HWB" },
		{ value: "cmyk", description: "CMYK" },
	];
</script>
