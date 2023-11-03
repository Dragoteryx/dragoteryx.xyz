import { useIntervalFn, useLocalStorage } from "@vueuse/core";
import { GameOfLife } from "@/wasm/pkg/wasm";
import { defineStore } from "pinia";
import { computed, reactive, ref, watchEffect } from "vue";

export const useGameOfLifeStore = defineStore("game-of-life", () => {
	const controls = useIntervalFn(update, 1000 / 60);
	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife();
	const aliveCells = ref(0);
	const paused = ref(true);

	//game.birth_cell(0, 0);
	
	const speed = useLocalStorage("game-of-life-speed", 10);
	const zoom = useLocalStorage("game-of-life-zoom", 10);
	const pos = reactive({ x: 0, y: 0 });
	const size = computed(() => {
		switch (zoom.value) {
			case 1:
				return 1;
			case 2:
				return 2;
			case 3:
				return 3;
			case 4:
				return 5;
			case 5:
				return 8;
			case 6:
				return 13;
			case 7:
				return 21;
			case 8:
				return 34;
			case 9:
				return 55;
			case 10:
				return 89;
			default:
				return NaN;
		}
	});

	watchEffect(() => game.pos_x = pos.x);
	watchEffect(() => game.pos_y = pos.y);
	watchEffect(() => game.size = size.value);

	function toGameCoordinates(x: number, y: number) {
		return {
			x: Math.floor((x + pos.x) / size.value),
			y: Math.floor((y + pos.y) / size.value),
		};
	}

	function toggleCell(x: number, y: number) {
		const coords = toGameCoordinates(x, y);
		if (game.toggle_cell(coords.x, coords.y)) {
			aliveCells.value++;
		} else {
			aliveCells.value--;
		}
	}

	function birthCell(x: number, y: number) {
		const coords = toGameCoordinates(x, y);
		if (game.birth_cell(coords.x, coords.y)) {
			aliveCells.value++;
		}
	}

	function killCell(x: number, y: number) {
		const coords = toGameCoordinates(x, y);
		if (game.kill_cell(coords.x, coords.y)) {
			aliveCells.value--;
		}
	}

	function zoomIn(x: number, y: number) {
		zoom.value = Math.min(10, zoom.value + 1);
	}

	function zoomOut(x: number, y: number) {
		zoom.value = Math.max(1, zoom.value - 1);
	}

	function clear() {
		aliveCells.value = 0;
		game.clear();
	}

	function tick() {
		aliveCells.value = game.tick();
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
			game.draw(ctx.value, getComputedStyle(ctx.value.canvas).getPropertyValue("--text"));
		}
	}

	return {
		controls, ctx,
		tick, paused,
		pos, speed, aliveCells,
		birthCell, killCell,
		toggleCell, clear,
		zoomIn, zoomOut,
	};
});