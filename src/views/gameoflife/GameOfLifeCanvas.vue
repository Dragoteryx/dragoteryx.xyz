<template>
	<Canvas2D @click="click" @drag="drag" @scroll="scroll" @ready="ready"/>
</template>

<script setup lang="ts">
	import Canvas2D from "@/components/Canvas2D.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";

	const gameOfLifeStore = useGameOfLifeStore();

	function click(x: number, y: number) {
		gameOfLifeStore.toggleCell(x, y);
	}
	
	function drag(x: number, y: number) {
		gameOfLifeStore.pos.x -= x;
		gameOfLifeStore.pos.y -= y;
	}

	function scroll(up: boolean, x: number, y: number) {
		if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}
	}

	function ready(ctx: CanvasRenderingContext2D) {
		gameOfLifeStore.ctx = ctx;
	}
</script>