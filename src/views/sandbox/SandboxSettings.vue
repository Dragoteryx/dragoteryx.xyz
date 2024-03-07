<template>
	<span><b>Gravity settings</b></span>
	<FormRange v-model="sandboxStore.gravityStrenth" :min="0" :max="9810" :reset="981">Strength</FormRange>
	<FormRange v-model="sandboxStore.gravityAngle" :min="-180" :max="180" :reset="0" rtl>Angle</FormRange>
	<hr>
	<span><b>Misc settings</b></span>
	<FormCheckbox v-model="sandboxStore.clearCanvas">Clear previous frame</FormCheckbox>
	<FormCheckbox v-model="sandboxStore.consoleLogs">Console logs</FormCheckbox>
</template>

<script setup lang="ts">
	import FormCheckbox from "@/components/form/FormCheckbox.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();
</script>