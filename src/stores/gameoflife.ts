import { useLocalStorage } from "@vueuse/core";
import { useControls } from "@/composables/controls";
import { useFibonacci } from "@/composables/math";
import { GameOfLife } from "@/wasm/pkg/wasm";
import { reactive, ref } from "vue";
import { defineStore } from "pinia";

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
			game.draw(ctx.value, textColor, Math.floor(pos.x), Math.floor(pos.y), size.value);
		}
	});

	controls.paused = true;

	const ctx = ref<CanvasRenderingContext2D>();
	const game = new GameOfLife((alive, neighbors) => {
		return alive ? neighbors == 2 || neighbors == 3 : neighbors == 3;
	});

	const aliveCells = ref(0);
	const speed = useLocalStorage("game-of-life-speed", 10);
	const zoom = useLocalStorage("game-of-life-zoom", 10);
	const size = useFibonacci(() => zoom.value + 1);
	const pos = reactive({ x: 0, y: 0 });

	function toGameCoordinates(mouseX: number, mouseY: number) {
		return {
			x: (mouseX + pos.x) / size.value,
			y: (mouseY + pos.y) / size.value,
		};
	}

	function toGameCoordinatesFloored(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinates(mouseX, mouseY);
		return {
			x: Math.floor(x),
			y: Math.floor(y),
		};
	}

	function toggleCell(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinatesFloored(mouseX, mouseY);
		if (game.toggle_cell(x, y)) aliveCells.value++;
		else aliveCells.value--;
	}

	function birthCell(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinatesFloored(mouseX, mouseY);
		if (game.birth_cell(x, y)) aliveCells.value++;
	}

	function killCell(mouseX: number, mouseY: number) {
		const { x, y } = toGameCoordinatesFloored(mouseX, mouseY);
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
		controls,
		ctx,
		pos,
		speed,
		aliveCells,
		birthCell,
		killCell,
		toggleCell,
		clear,
		zoomIn,
		zoomOut,
	};
});
