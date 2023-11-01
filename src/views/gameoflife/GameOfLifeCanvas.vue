<template>
	<Canvas2D
		:width="width" :height="height"
		@click="click" @drag="drag" @scroll="scroll"
		@ctx="gameOfLifeStore.ctx = $event"
	/>
</template>

<script setup lang="ts">
	import Canvas2D from "@/components/Canvas2D.vue";
	import { useDimensionsStore } from "@/stores/dimensions";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import { computed } from "vue";

	const gameOfLifeStore = useGameOfLifeStore();
	const dimensionsStore = useDimensionsStore();
	const width = computed(() => dimensionsStore.windowWidth - dimensionsStore.asideMenuWidth);
	const height = computed(() => dimensionsStore.windowHeight - dimensionsStore.gameOfLifeMenuHeight);

	function click(x: number, y: number) {
		gameOfLifeStore.toggleCell(x, y);
	}

	function drag(x: number, y: number) {
		gameOfLifeStore.xOffset += x;
		gameOfLifeStore.yOffset += y;
	}

	function scroll(up: boolean, x: number, y: number) {
		/*if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}*/
	}
</script>