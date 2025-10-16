<template>
	<span><b>Gravity settings</b></span>
	<FormRange v-model="sandboxStore.gravity.strength" :min="0" :max="9810" :reset="981">Strength</FormRange>
	<FormRange v-model="sandboxStore.gravity.angle" :min="-180" :max="180" :reset="0" dir="rtl">Angle</FormRange>
	<hr />
	<span><b>Misc settings</b></span>
	<FormCheckbox v-model="sandboxStore.options.clearCanvas">Clear previous frame</FormCheckbox>
	<FormCheckbox v-model="sandboxStore.options.consoleLogs">Console logs</FormCheckbox>
	<span>Color picker</span>
	<FormSelect v-model="sandboxStore.options.colorPicker" :options="colorPickers" />
</template>

<script setup lang="ts">
	import FormCheckbox from "@/components/form/FormCheckbox.vue";
	import FormSelect from "@/components/form/FormSelect.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();
	const colorPickers = [
		{ value: "rgb", description: "RGB" },
		{ value: "hsl", description: "HSL" },
		{ value: "hsv", description: "HSV" },
		{ value: "hwb", description: "HWB" },
		{ value: "cmyk", description: "CMYK" },
	];
</script>
