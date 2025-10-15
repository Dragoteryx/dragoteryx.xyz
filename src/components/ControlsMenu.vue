<template>
	<div class="row spaced">
		<FormButton class="large" :class="color" :icon="icon" @click="toggle">{{ text }}</FormButton>
		<FormButton class="large" icon="pi-forward" @click="tick">Step</FormButton>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import type { Controls } from "@/composables/controls";
	import { computed } from "vue";

	const text = computed(() => (props.controls.paused ? "Resume" : "Pause"));
	const color = computed(() => (props.controls.paused ? "blue" : "orange"));
	const icon = computed(() => (props.controls.paused ? "pi-play" : "pi-pause"));
	const props = defineProps<{
		controls: Controls;
	}>();

	function toggle() {
		props.controls.paused = !props.controls.paused;
	}

	function tick() {
		props.controls.tick();
	}
</script>
