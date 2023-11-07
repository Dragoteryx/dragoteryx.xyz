import { useIntervalFn, useLocalStorage } from "@vueuse/core";
import { reactive, ref, watchEffect } from "vue";
import { defineStore } from "pinia";
import { Sandbox } from "@/wasm/pkg";

export const useSandboxStore = defineStore("sandbox", () => {
	const controls = useIntervalFn(update, 1000/60);
	const ctx = ref<CanvasRenderingContext2D>();
	const sandbox = new Sandbox();
	const entities = ref(0);
	const height = ref(0);
	const width = ref(0);

	const paused = ref(false);
	const radius = useLocalStorage("sandbox-radius", 15);
	const clearCanvas = useLocalStorage("sandbox-clear-canvas", true);
	const consoleLogs = useLocalStorage("sandbox-console-logs", false);
	const gravityStrenth = useLocalStorage("sandbox-gravity-strength", 981);
	const gravityAngle = useLocalStorage("sandbox-gravity-angle", 0);
	const color = reactive({
		h: useLocalStorage("sandbox-color-h", 90),
		s: useLocalStorage("sandbox-color-s", 50),
		l: useLocalStorage("sandbox-color-l", 50)
	});

	watchEffect(() => sandbox.console_logs = consoleLogs.value);
	watchEffect(() => sandbox.world_height = height.value);
	watchEffect(() => sandbox.world_width = width.value);
	watchEffect(() => sandbox.gravity_strength = gravityStrenth.value);
	watchEffect(() => sandbox.gravity_angle = gravityAngle.value);
	watchEffect(() => sandbox.color_h = color.h);
	watchEffect(() => sandbox.color_s = color.s);
	watchEffect(() => sandbox.color_l = color.l);
	
	function update() {
		if (!paused.value) tick();
		if (ctx.value) {
			if (clearCanvas.value)
				ctx.value.clearRect(0, 0, width.value, height.value);
			sandbox.draw(ctx.value);
		}
	}

	function tick() {
		sandbox.tick();
	}

	function addCircle(x: number, y: number) {
		sandbox.add_circle(x, y, radius.value);
		entities.value++;
	}

	function clearEntities() {
		sandbox.clear_entities();
		entities.value = 0;
	}

	return {
		controls, ctx,
		tick, paused,
		color, radius,
		height, width,
		gravityStrenth, gravityAngle,
		clearCanvas, consoleLogs, 
		entities, addCircle,
		clearEntities, 
	};
});