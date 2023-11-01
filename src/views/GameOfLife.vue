<template>
	<div id="game-of-life" class="column">
		<GameOfLifeCanvas/>
		<GameOfLifeMenu/>
	</div>
</template>

<script setup lang="ts">
	import GameOfLifeCanvas from "./gameoflife/GameOfLifeCanvas.vue";
	import GameOfLifeMenu from "./gameoflife/GameOfLifeMenu.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import { onMounted, onUnmounted } from "vue";

	const gameOfLifeStore = useGameOfLifeStore();

	onMounted(() => {
		gameOfLifeStore.controls.resume();
	});

	onUnmounted(() => {
		gameOfLifeStore.controls.pause();
	});
</script>

<style scoped lang="scss">
	#game-of-life {
		height: 100%;
	}
</style>