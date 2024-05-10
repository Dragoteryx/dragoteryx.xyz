import { useControls, useFibonacci } from "@/composables/misc";
import { useLocalStorage } from "@vueuse/core";
import { reactive, ref, watchEffect } from "vue";
import { GameOfLife } from "@/wasm/pkg/wasm";
import { defineStore } from "pinia";

export interface Range {
	start: number;
	end: number;
}

export const useGameOfLifeStore = defineStore("game-of-life", () => {
	let lastTime = 0;
	const controls = useControls(paused => {
		if (!paused) {
			const now = performance.now();
			if (now - lastTime >= 1000 / speed.value) {
				aliveCells.value = game.tick();
				lastTime = now;
			}
		}

		if (ctx.value) {
			ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);
			game.draw(ctx.value, getComputedStyle(ctx.value.canvas).getPropertyValue("--text"));
		}
	});

	controls.paused = true;

	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife();
	const aliveCells = ref(0);
	
	const speed = useLocalStorage("game-of-life-speed", 10);
	const zoom = useLocalStorage("game-of-life-zoom", 10);
	const size = useFibonacci(() => zoom.value + 1);
	const pos = reactive({ x: 0, y: 0 });

	const aliveRange: Range = reactive({
		start: useLocalStorage("game-of-life-alive-range-start", 2),
		end: useLocalStorage("game-of-life-alive-range-end", 3),
	});

	const birthRange: Range = reactive({
		start: useLocalStorage("game-of-life-birth-range-start", 3),
		end: useLocalStorage("game-of-life-birth-range-end", 3),
	});

	watchEffect(() => game.pos_x = pos.x);
	watchEffect(() => game.pos_y = pos.y);
	watchEffect(() => game.size = size.value);
	watchEffect(() => game.alive_range_start = aliveRange.start);
	watchEffect(() => game.alive_range_end = aliveRange.end);
	watchEffect(() => game.birth_range_start = birthRange.start);
	watchEffect(() => game.birth_range_end = birthRange.end);

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

	return {
		controls, ctx,
		pos, speed, aliveCells,
		birthCell, killCell,
		toggleCell, clear,
		zoomIn, zoomOut,
		aliveRange,
		birthRange,
	};
});