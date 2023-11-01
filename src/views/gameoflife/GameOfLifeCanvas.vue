<template>
	<canvas
		ref="canvas"
		:width="width"
		:height="height"
		@click="click"
	></canvas>
</template>

<script setup lang="ts">
	import { useDimensionsStore } from "@/stores/dimensions";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import { computed, ref, watchEffect } from "vue";

	const canvas = ref<HTMLCanvasElement>();
	const gameOfLifeStore = useGameOfLifeStore();
	const dimensionsStore = useDimensionsStore();

	const width = computed(() => dimensionsStore.windowWidth - dimensionsStore.asideMenuWidth);
	const height = computed(() => dimensionsStore.windowHeight - dimensionsStore.gameOfLifeMenuHeight);

	watchEffect(() => {
		gameOfLifeStore.ctx = canvas.value?.getContext("2d") ?? undefined;
	});

	function click(event: MouseEvent) {
		const x = (event.x - (canvas.value?.offsetLeft ?? 0)) / 10;
		const y = (event.y - (canvas.value?.offsetTop ?? 0)) / 10;
		gameOfLifeStore.toggleCell(x, y);
	}
</script>