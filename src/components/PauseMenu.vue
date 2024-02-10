<template>
	<div class="row spaced">
		<FormButton class="large" :class="color" :icon="icon" @click="paused = !paused">{{ text }}</FormButton>
		<FormButton class="large" icon="pi-forward" @click="emit('tick')">Step</FormButton>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import { computed } from "vue";

	const paused = defineModel<boolean>({ default: false });
	const text = computed(() => paused.value ? "Resume" : "Pause");
	const color = computed(() => paused.value ? "blue" : "orange");
	const icon = computed(() => paused.value ? "pi-play" : "pi-pause");
	const emit = defineEmits<{
		tick: [],
	}>();
</script>