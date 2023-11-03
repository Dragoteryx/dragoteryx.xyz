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
	const height = computed(() => Math.max(1, dimensionsStore.windowHeight));
	const width = computed(() => {
		return Math.max(1, dimensionsStore.windowWidth - dimensionsStore.asideMenuWidth - dimensionsStore.gameOfLifeMenuWidth);
	});

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
</script>