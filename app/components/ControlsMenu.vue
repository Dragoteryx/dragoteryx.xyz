<template>
	<div class="flex flex-row gap-2">
		<FormButton class="flex-1" :class="color" :icon="icon" @click="toggle">{{ text }}</FormButton>
		<FormButton class="flex-1" icon="lucide:step-forward" @click="tick">Step</FormButton>
	</div>
</template>

<script setup lang="ts">
	export interface Props {
		controls: Controls;
	}

	const props = defineProps<Props>();
	const text = computed(() => (props.controls.paused ? "Resume" : "Pause"));
	const color = computed(() => (props.controls.paused ? "blue" : "orange"));
	const icon = computed(() => (props.controls.paused ? "lucide:play" : "lucide:pause"));

	function toggle() {
		props.controls.paused = !props.controls.paused;
	}

	function tick() {
		props.controls.tick();
	}
</script>
