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
			game.draw(ctx.value, getComputedStyle(ctx.value.canvas).getPropertyValue("--text"), pos.x, pos.y, size.value);
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

	watchEffect(() => game.alive_range_start = aliveRange.start);
	watchEffect(() => game.alive_range_end = aliveRange.end);
	watchEffect(() => game.birth_range_start = birthRange.start);
	watchEffect(() => game.birth_range_end = birthRange.end);

	function toGameCoordinates(mouseX: number, mouseY: number) {
		return {
			x: Math.floor((mouseX + pos.x) / size.value),
			y: Math.floor((mouseY + pos.y) / size.value),
		};
	}

	function toggleCell(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinates(mouseX, mouseY);
		if (game.toggle_cell(x, y)) aliveCells.value++;
		else aliveCells.value--;
	}

	function birthCell(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinates(mouseX, mouseY);
		if (game.birth_cell(x, y)) aliveCells.value++;
	}

	function killCell(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinates(mouseX, mouseY);
		if (game.kill_cell(x, y)) aliveCells.value--;
	}

	function zoomIn(mouseX: number, mouseY: number) {
		const before = toGameCoordinates(mouseX, mouseY);
		zoom.value = Math.min(10, zoom.value + 1);
		const after = toGameCoordinates(mouseX, mouseY);
		pos.x += (before.x - after.x) * size.value;
		pos.y += (before.y - after.y) * size.value;
	}

	function zoomOut(mouseX: number, mouseY: number) {
		const before = toGameCoordinates(mouseX, mouseY);
		zoom.value = Math.max(1, zoom.value - 1);
		const after = toGameCoordinates(mouseX, mouseY);
		pos.x += (before.x - after.x) * size.value;
		pos.y += (before.y - after.y) * size.value;
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