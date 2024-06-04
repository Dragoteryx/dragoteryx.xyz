<template>
	<CanvasMenu :controls="boidsStore.controls" @ready="ready" @click="click" @resize="resize">

	</CanvasMenu>
</template>

<script setup lang="ts">
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import { useBoidsStore } from "@/stores/boids";

	const boidsStore = useBoidsStore();

	function ready(ctx: CanvasRenderingContext2D) {
		boidsStore.ctx = ctx;
	}

	function click(x: number, y: number) {
		
	}

	function resize(width: number, height: number) {
		boidsStore.width = width;
		boidsStore.height = height;
	}
</script>