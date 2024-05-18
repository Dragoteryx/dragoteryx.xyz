<template>
	<CanvasMenu :controls="boidsStore.controls" @ready="ready" @resize="resize" @click="">
		<span>Test</span>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import { useBoidsStore } from "@/stores/boids";

	const boidsStore = useBoidsStore();

	function ready(ctx: CanvasRenderingContext2D) {
		boidsStore.ctx = ctx;
	}

	function resize(width: number, height: number) {
		boidsStore.width = width;
		boidsStore.height = height;
	}
</script>