import { useIntervalFn, useLocalStorage } from "@vueuse/core";
import { GameOfLife } from "@/wasm/pkg/wasm";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useGameOfLifeStore = defineStore("game-of-life", () => {
	const controls = useIntervalFn(update, 1000 / 60);
	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife();
	const aliveCells = ref(0);
	
	const speed = useLocalStorage("game-of-life-speed", 10);
	const paused = ref(true);
	const xOffset = ref(0);
	const yOffset = ref(0);

	const zoom = useLocalStorage("game-of-life-zoom", 4);
	const size = computed(() => {
		switch (zoom.value) {
			case 1:
				return 3;
			case 2:
				return 5;
			case 3:
				return 8;
			case 4:
				return 13;
			case 5:
				return 21;
			case 6:
				return 34;
			case 7:
				return 55;
			case 8:
				return 89;
			default:
				return NaN;
		}
	});

	function toggleCell(x: number, y: number) {
		const xCoord = Math.floor((x - xOffset.value) / size.value);
		const yCoord = Math.floor((y - yOffset.value) / size.value);
		game.toggle_cell(xCoord, yCoord);
		aliveCells.value = game.alive_cells;
	}

	function zoomIn(x: number, y: number) {
		zoom.value = Math.min(8, zoom.value + 1);
	}

	function zoomOut(x: number, y: number) {
		zoom.value = Math.max(1, zoom.value - 1);
	}

	function clear() {
		game.clear();
		aliveCells.value = game.alive_cells;
	}

	function tick() {
		game.tick();
		aliveCells.value = game.alive_cells;
	}

	let lastTime = 0;
	function update() {
		if (!paused.value) {
			const now = performance.now();
			if (now - lastTime >= 1000 / speed.value) {
				lastTime = now;
				tick();
			}
		}

		if (ctx.value) {
			ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);
			game.draw(ctx.value, getComputedStyle(ctx.value.canvas).getPropertyValue("--text"), size.value, xOffset.value, yOffset.value);
		}
	}

	return {
		ctx,
		controls,
		tick,
		paused,
		toggleCell,
		clear,
		aliveCells,
		xOffset,
		yOffset,
		zoomIn,
		zoomOut,
		speed,
	};
});