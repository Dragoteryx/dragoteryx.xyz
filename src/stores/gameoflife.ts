import type { Option } from "@/components/form/FormSelect.vue";
import { GameOfLife, type Rule } from "@/wasm/pkg/wasm";
import { useLocalStorage } from "@vueuse/core";
import { useControls } from "@/composables/controls";
import { useFibonacci } from "@/composables/math";
import { computed, reactive, ref } from "vue";
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

export function randomRule(alive: boolean, neighbors: number): boolean {
	return Math.random() < 0.5;
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
			const style = window.getComputedStyle(document.body);
			const textColor = style.getPropertyValue("--text");
			ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);
			game.draw(ctx.value, Math.floor(canvasPos.x), Math.floor(canvasPos.y), size.value, textColor);
		}
	});

	controls.paused = true;

	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife((alive, neighbors) => {
		return rules[rule.value]?.value(alive, neighbors) ?? alive;
	});

	const aliveCells = ref(0);
	const canvasPos = reactive({ x: 0, y: 0 });
	const size = useFibonacci(() => zoom.value + 1);
	const zoom = useLocalStorage("game-of-life-zoom", 10);
	const speed = useLocalStorage("game-of-life-speed", 10);
	const rule = useLocalStorage("game-of-life-rule", "conways");
	const rules = reactive<Record<string, Option<Rule>>>({
		conways: { description: "Conway's Game of Life", value: conwaysRule },
		lifeWithoutDeath: { description: "Life without death", value: lifeWithoutDeathRule },
		highlife: { description: "Highlife", value: highlifeRule },
		seeds: { description: "Seeds", value: seedsRule },
		random: { description: "Random", value: randomRule },
	});

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

	return {
		controls,
		ctx,
		canvasPos,
		speed,
		rule,
		rules,
		aliveCells,
		birthCell,
		killCell,
		toggleCell,
		clear,
		zoomIn,
		zoomOut,
		toGameCoordinates,
		toGameCoordinatesFloored,
	};
});
