import { useLocalStorageColor } from "@/composables/color";
import { useControls } from "@/composables/controls";
import { Color, Hsl, toRgb } from "@/types/color";
import { useLocalStorage } from "@vueuse/core";
import { reactive, ref, watchEffect } from "vue";
import { defineStore } from "pinia";
import { Sandbox } from "@/wasm/pkg";

export interface Gravity {
	strength: number;
	angle: number;
}

export interface Options {
	colorPicker: Exclude<Color["type"], "hex">;
	clearCanvas: boolean;
	consoleLogs: boolean;
}

export const useSandboxStore = defineStore("sandbox", () => {
	const controls = useControls((paused) => {
		if (!paused) sandbox.tick();
		if (ctx.value) {
			if (options.clearCanvas) {
				ctx.value.clearRect(0, 0, width.value, height.value);
			}
			sandbox.draw(ctx.value);
		}
	});

	const ctx = ref<CanvasRenderingContext2D>();
	const sandbox = new Sandbox();
	const entities = ref(0);
	const height = ref(0);
	const width = ref(0);

	const defaultColor = Color.parse({type: "hsl", value: Hsl.parse({h: 90, s: 50, l: 50})});
	const color = useLocalStorageColor("sandbox-color", defaultColor);
	const radius = useLocalStorage("sandbox-radius", 13);

	const gravity: Gravity = reactive({
		strength: useLocalStorage("sandbox-gravity-strength", 981),
		angle: useLocalStorage("sandbox-gravity-angle", 0),
	});

	const options: Options = reactive({
		colorPicker: useLocalStorage<Exclude<Color["type"], "hex">>("sandbox-color-picker", "hsl"),
		clearCanvas: useLocalStorage("sandbox-clear-canvas", true),
		consoleLogs: useLocalStorage("sandbox-console-logs", false),
	});

	watchEffect(() => sandbox.console_logs = options.consoleLogs);
	watchEffect(() => sandbox.world_height = height.value);
	watchEffect(() => sandbox.world_width = width.value);
	watchEffect(() => sandbox.gravity_strength = gravity.strength);
	watchEffect(() => sandbox.gravity_angle = gravity.angle);
	watchEffect(() => {
		const {r, g, b} = toRgb(color.value);
		sandbox.color_r = r;
		sandbox.color_g = g;
		sandbox.color_b = b;
	});

	function addCircle(x: number, y: number) {
		sandbox.add_circle(x, y, radius.value);
		entities.value++;
	}

	function clearEntities() {
		sandbox.clear_entities();
		entities.value = 0;
	}

	return {
		controls,
		ctx,
		defaultColor,
		color,
		radius,
		height,
		width,
		gravity,
		options,
		entities,
		addCircle,
		clearEntities,
	};
});
