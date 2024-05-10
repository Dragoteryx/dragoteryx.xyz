<template>
	<Canvas2D @ready="ready" @click="click" @drag="drag" @scroll="scroll"/>
</template>

<script setup lang="ts">
	import Canvas2D from "@/components/Canvas2D.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";

	const gameOfLifeStore = useGameOfLifeStore();

	function ready(ctx: CanvasRenderingContext2D) {
		gameOfLifeStore.ctx = ctx;
	}

	function click(x: number, y: number) {
		gameOfLifeStore.toggleCell(x, y);
	}
	
	function drag(x: number, y: number) {
		gameOfLifeStore.pos.x += x;
		gameOfLifeStore.pos.y += y;
	}

	function scroll(up: boolean, x: number, y: number) {
		if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}
	}
</script>