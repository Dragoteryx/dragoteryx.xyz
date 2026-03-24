import type { Rule } from "@/wasm/pkg/wasm";

function conwaysRule(alive: boolean, neighbors: number): boolean {
	return alive ? neighbors == 2 || neighbors == 3 : neighbors == 3;
}

function highlifeRule(alive: boolean, neighbors: number): boolean {
	return alive ? neighbors == 2 || neighbors == 3 : neighbors == 3 || neighbors == 6;
}

function seedsRule(alive: boolean, neighbors: number): boolean {
	return !alive && neighbors == 2;
}

function lifeWithoutDeathRule(alive: boolean, neighbors: number): boolean {
	return alive || neighbors == 3;
}

const rules: Record<string, [string, Rule]> = {
	conways: ["Conway's Game of Life", conwaysRule],
	lifeWithoutDeath: ["Life without death", lifeWithoutDeathRule],
	highlife: ["Highlife", highlifeRule],
	seeds: ["Seeds", seedsRule],
};

export const useGameOfLifeStore = defineStore("game-of-life", () => {
	const game = useWasmModule(module => {
		return new module.GameOfLife((alive, neighbors) => {
			return rules[rule.value]?.[1](alive, neighbors) ?? alive;
		});
	});

	const aliveCells = ref(0);
	const rule = ref("conways");
	const debug = ref(false);
	const speed = ref(10);
	const zoom = ref(10);
	const canvasPos = reactive({ x: 0, y: 0 });
	const ctx = ref<CanvasRenderingContext2D>();
	const size = useFibonacci(() => zoom.value + 1);
	const snapshots = reactive<Map<string, string>>(new Map());
	const controls = useControls(speed, paused => {
		if (!paused) aliveCells.value = game.value?.tick() ?? 0;
		draw();
	});

	controls.paused = true;
	watch(size, () => draw());
	watch(canvasPos, () => draw());
	watchEffect(() => {
		if (!game.value) return;
		game.value.debug = debug.value;
		draw();
	});

	function createSnapshot(name: string) {
		if (game.value) snapshots.set(name, game.value.json);
	}

	function loadSnapshot(name: string) {
		if (game.value) {
			game.value.json = snapshots.get(name) ?? "[]";
			draw();
		}
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
		if (game.value) {
			const { x, y } = toGameCoordinatesFloored(canvasX, canvasY);
			if (game.value.toggle_cell(x, y)) aliveCells.value++;
			else aliveCells.value--;
			draw();
		}
	}

	function birthCell(canvasX: number, canvasY: number) {
		if (game.value) {
			const { x, y } = toGameCoordinatesFloored(canvasX, canvasY);
			if (game.value.birth_cell(x, y) ?? false) {
				aliveCells.value++;
				draw();
			}
		}
	}

	function killCell(canvasX: number, canvasY: number) {
		if (game.value) {
			const { x, y } = toGameCoordinatesFloored(canvasX, canvasY);
			if (game.value.kill_cell(x, y) ?? false) {
				aliveCells.value--;
				draw();
			}
		}
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
		game.value?.clear();
		draw();
	}

	function draw() {
		if (game.value && ctx.value) {
			const style = window.getComputedStyle(document.body);
			const textColor = style.getPropertyValue("--text");
			ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);
			game.value.draw(ctx.value, Math.floor(canvasPos.x), Math.floor(canvasPos.y), size.value, textColor);
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
