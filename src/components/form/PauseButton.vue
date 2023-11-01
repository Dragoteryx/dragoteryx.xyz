<template>
	<FormButton :class="color" :icon="icon" @click="paused = !paused">
		{{ paused ? "Resume" : "Pause" }}
	</FormButton>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import { computed } from "vue";

	const paused = defineModel<boolean>({ default: false });
	const color = computed(() => paused.value ? "blue" : "orange");
	const icon = computed(() => paused.value ? "pi-play" : "pi-pause");
</script>