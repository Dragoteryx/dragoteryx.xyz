<template>
	<CanvasMenu
		:controls="gameOfLifeStore.controls"
		v-model:context="gameOfLifeStore.ctx"
		@click="gameOfLifeStore.toggleCell"
		@scroll="scroll"
		@drag="drag"
	>
		<FormButton class="red" icon="pi-trash" @click="gameOfLifeStore.clear"
			>Kill {{ gameOfLifeStore.aliveCells }} alive cells</FormButton
		>
		<hr />
		<FormRange :reset="10" :min="1" :max="60" v-model="gameOfLifeStore.speed">Speed</FormRange>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import FormButton from "@/components/form/FormButton.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";

	const gameOfLifeStore = useGameOfLifeStore();

	function drag(x: number, y: number) {
		gameOfLifeStore.pos.x += x;
		gameOfLifeStore.pos.y += y;
	}

	function scroll(x: number, y: number, up: boolean) {
		if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}
	}
</script>
