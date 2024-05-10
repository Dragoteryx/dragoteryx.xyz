import { type Color } from "@/components/form/FormColor.vue";
import { useControls } from "@/composables/misc";
import { useLocalStorage } from "@vueuse/core";
import { reactive, ref, watchEffect } from "vue";
import { defineStore } from "pinia";
import { Sandbox } from "@/wasm/pkg";

export interface Gravity {
	strength: number;
	angle: number;
}

export const useSandboxStore = defineStore("sandbox", () => {
	const controls = useControls(paused => {
		if (!paused) sandbox.tick();
		if (ctx.value) {
			if (clearCanvas.value)
				ctx.value.clearRect(0, 0, width.value, height.value);
			sandbox.draw(ctx.value);
		}
	});

	const ctx = ref<CanvasRenderingContext2D>();
	const sandbox = new Sandbox();
	const entities = ref(0);
	const height = ref(0);
	const width = ref(0);
	
	const clearCanvas = useLocalStorage("sandbox-clear-canvas", true);
	const consoleLogs = useLocalStorage("sandbox-console-logs", false);

	const radius = useLocalStorage("sandbox-radius", 13);
	const color: Color = reactive({
		h: useLocalStorage("sandbox-color-h", 90),
		s: useLocalStorage("sandbox-color-s", 50),
		l: useLocalStorage("sandbox-color-l", 50)
	});

	const gravity: Gravity = reactive({
		strength: useLocalStorage("sandbox-gravity-strength", 981),
		angle: useLocalStorage("sandbox-gravity-angle", 0)
	});

	watchEffect(() => sandbox.console_logs = consoleLogs.value);
	watchEffect(() => sandbox.world_height = height.value);
	watchEffect(() => sandbox.world_width = width.value);
	watchEffect(() => sandbox.gravity_strength = gravity.strength);
	watchEffect(() => sandbox.gravity_angle = gravity.angle);
	watchEffect(() => sandbox.color_h = color.h);
	watchEffect(() => sandbox.color_s = color.s);
	watchEffect(() => sandbox.color_l = color.l);

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
		color, radius,
		height, width,
		gravity,
		clearCanvas, consoleLogs, 
		entities, addCircle,
		clearEntities, 
	};
});