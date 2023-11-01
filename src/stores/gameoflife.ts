import { useIntervalFn } from "@vueuse/core";
import { GameOfLife } from "@/wasm/pkg/wasm";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameOfLifeStore = defineStore("game-of-life", () => {
	const controls = useIntervalFn(update, 100);
	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife();

	const paused = ref(true);
	const cells = ref(0);

	function birthCell(x: number, y: number) {
		game.birth_cell(x, y);
		cells.value = game.alive_cells();
	}

	function killCell(x: number, y: number) {
		game.kill_cell(x, y);
		cells.value = game.alive_cells();
	}

	function toggleCell(x: number, y: number) {
		game.toggle_cell(x, y);
		cells.value = game.alive_cells();
	}

	function clear() {
		game.clear();
		cells.value = game.alive_cells();
	}

	function tick() {
		game.tick();
		cells.value = game.alive_cells();
	}

	function update() {
		if (!paused.value) tick();
		if (ctx.value) {
			ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);
			game.draw(ctx.value, getComputedStyle(ctx.value.canvas).getPropertyValue("--text"));
		}
	}

	return {
		ctx,
		controls,
		tick,
		paused,
		birthCell,
		killCell,
		toggleCell,
		clear,
		cells,
	};
});