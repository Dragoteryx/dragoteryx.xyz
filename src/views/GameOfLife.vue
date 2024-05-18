<template>
	<CanvasMenu :controls="gameOfLifeStore.controls" @ready="ready" @click="click" @drag="drag" @scroll="scroll">
		<FormButton class="red" icon="pi-trash" @click="gameOfLifeStore.clear">Kill {{ gameOfLifeStore.aliveCells }} alive cells</FormButton>
		<hr>
		<FormRange :reset="10" :min="1" :max="60" v-model="gameOfLifeStore.speed">Speed</FormRange>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import FormButton from "@/components/form/FormButton.vue";
	import FormRange from "@/components/form/FormRange.vue";
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