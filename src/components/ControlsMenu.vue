<template>
	<div class="row spaced">
		<FormButton class="large" :class="color" :icon="icon" @click="toggle">{{ text }}</FormButton>
		<FormButton class="large" :icon="Forward" @click="tick">Step</FormButton>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import type { Controls } from "@/composables/controls";
	import { Play, Pause, Forward } from "lucide-vue-next";
	import { computed } from "vue";

	export interface Props {
		controls: Controls;
	}

	const props = defineProps<Props>();
	const text = computed(() => (props.controls.paused ? "Resume" : "Pause"));
	const color = computed(() => (props.controls.paused ? "blue" : "orange"));
	const icon = computed(() => (props.controls.paused ? Play : Pause));

	function toggle() {
		props.controls.paused = !props.controls.paused;
	}

	function tick() {
		props.controls.tick();
	}
</script>
