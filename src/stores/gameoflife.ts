import { reactive, ref, watchEffect, readonly } from "vue";
import { GameOfLife, type Rule } from "@/wasm/pkg/wasm";
import { useLocalStorage } from "@vueuse/core";
import { useControls } from "@/composables/controls";
import { useFibonacci } from "@/composables/math";
import { defineStore } from "pinia";

export function conwaysRule(alive: boolean, neighbors: number): boolean {
	return alive ? neighbors == 2 || neighbors == 3 : neighbors == 3;
}

export function highlifeRule(alive: boolean, neighbors: number): boolean {
	return alive ? neighbors == 2 || neighbors == 3 : neighbors == 3 || neighbors == 6;
}

export function seedsRule(alive: boolean, neighbors: number): boolean {
	return !alive && neighbors == 2;
}

export function lifeWithoutDeathRule(alive: boolean, neighbors: number): boolean {
	return alive || neighbors == 3;
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

		draw();
	});

	controls.paused = true;

	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife((alive, neighbors) => {
		return rules[rule.value]?.[1](alive, neighbors) ?? alive;
	});

	const aliveCells = ref(0);
	const canvasPos = reactive({ x: 0, y: 0 });
	const size = useFibonacci(() => zoom.value + 1);
	const zoom = useLocalStorage("game-of-life-zoom", 10);
	const speed = useLocalStorage("game-of-life-speed", 10);
	const debug = useLocalStorage("game-of-life-debug", false);
	const rule = useLocalStorage("game-of-life-rule", "conways");
	const snapshots = reactive<Map<string, string>>(new Map());
	const rules = reactive<Record<string, [string, Rule]>>({
		conways: ["Conway's Game of Life", conwaysRule],
		lifeWithoutDeath: ["Life without death", lifeWithoutDeathRule],
		highlife: ["Highlife", highlifeRule],
		seeds: ["Seeds", seedsRule],
	});

	watchEffect(() => (game.debug = debug.value));

	function createSnapshot(name: string) {
		snapshots.set(name, game.json);
	}

	function loadSnapshot(name: string) {
		game.json = snapshots.get(name) ?? "[]";
	}

	function removeSnapshot(name: string) {
		snapshots.delete(name);
	}

	function clearSnapshots() {
		snapshots.clear();
	}

	function toGameCoordinates(canvasX: number, canvasY: number) {
		return {
			x: (canvasX + canvasPos.x) / size.value,
			y: (canvasY + canvasPos.y) / size.value,
		};
	}

	function toGameCoordinatesFloored(canvasX: number, canvasY: number) {
		const { x, y } = toGameCoordinates(canvasX, canvasY);
		return {
			x: Math.floor(x),
			y: Math.floor(y),
		};
	}

	function toggleCell(canvasX: number, canvasY: number) {
		const { x, y } = toGameCoordinatesFloored(canvasX, canvasY);
		if (game.toggle_cell(x, y)) aliveCells.value++;
		else aliveCells.value--;
	}

	function birthCell(canvasX: number, canvasY: number) {
		const { x, y } = toGameCoordinatesFloored(canvasX, canvasY);
		if (game.birth_cell(x, y)) aliveCells.value++;
	}

	function killCell(canvasX: number, canvasY: number) {
		const { x, y } = toGameCoordinatesFloored(canvasX, canvasY);
		if (game.kill_cell(x, y)) aliveCells.value--;
	}

	function zoomIn(canvasX: number, canvasY: number) {
		const before = toGameCoordinates(canvasX, canvasY);
		zoom.value = Math.min(10, zoom.value + 1);
		const after = toGameCoordinates(canvasX, canvasY);
		canvasPos.x += (before.x - after.x) * size.value;
		canvasPos.y += (before.y - after.y) * size.value;
	}

	function zoomOut(canvasX: number, canvasY: number) {
		const before = toGameCoordinates(canvasX, canvasY);
		zoom.value = Math.max(1, zoom.value - 1);
		const after = toGameCoordinates(canvasX, canvasY);
		canvasPos.x += (before.x - after.x) * size.value;
		canvasPos.y += (before.y - after.y) * size.value;
	}

	function clear() {
		aliveCells.value = 0;
		game.clear();
	}

	function draw() {
		if (ctx.value) {
			const style = window.getComputedStyle(document.body);
			const textColor = style.getPropertyValue("--text");
			ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);
			game.draw(ctx.value, Math.floor(canvasPos.x), Math.floor(canvasPos.y), size.value, textColor);
		}
	}

	return {
		controls,
		ctx,
		canvasPos,
		speed,
		rule,
		rules,
		debug,
		aliveCells,
		birthCell,
		killCell,
		toggleCell,
		clear,
		draw,
		zoomIn,
		zoomOut,
		toGameCoordinates,
		toGameCoordinatesFloored,
		snapshots: readonly(snapshots),
		createSnapshot,
		loadSnapshot,
		removeSnapshot,
		clearSnapshots,
	};
});
