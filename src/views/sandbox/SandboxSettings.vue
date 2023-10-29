<template>
	<span><b>Gravity settings</b></span>
	<FormRange v-model="sandboxStore.gravityStrenth" :min="0" :max="9810" :reset="981">Strength</FormRange>
	<FormRange v-model="sandboxStore.gravityAngle" :min="0" :max="360" :reset="0">Angle</FormRange>
</template>

<script setup lang="ts">
	import FormRange from "@/components/form/FormRange.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();
</script>