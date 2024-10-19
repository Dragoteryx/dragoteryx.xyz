<template>
	<CanvasMenu
		:controls="boidsStore.controls"
		v-model:width="boidsStore.width"
		v-model:height="boidsStore.height"
		v-model:context="boidsStore.ctx"
	>

	</CanvasMenu>
</template>

<script setup lang="ts">
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import { useBoidsStore } from "@/stores/boids";

	const boidsStore = useBoidsStore();
</script>