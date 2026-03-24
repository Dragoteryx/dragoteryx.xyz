import { skipHydrate } from "pinia";

const { Sandbox } = import.meta.client ? await import("@/wasm/pkg") : {};

export interface Gravity {
	strength: number;
	angle: number;
}

export interface Options {
	clearCanvas: boolean;
	consoleLogs: boolean;
	colorPicker: string;
}

export const useSandboxStore = defineStore("sandbox", () => {
	const controls = useTimedControls(60, (paused, dt) => {
		if (!paused) sandbox?.tick(Math.min(1 / 45, dt));
		draw();
	});

	const ctx = ref<CanvasRenderingContext2D>();
	const sandbox = Sandbox ? new Sandbox() : null;
	const entities = ref(0);
	const height = ref(0);
	const width = ref(0);

	const defaultColor = new Hsl(90, 50, 50);
	const color = skipHydrate(ref(defaultColor));
	const radius = ref(13);

	const gravity: Gravity = reactive({
		strength: ref(981),
		angle: ref(0),
	});

	const options: Options = reactive({
		colorPicker: ref("hsl"),
		clearCanvas: ref(true),
		consoleLogs: ref(false),
	});

	watchEffect(() => {
		if (sandbox) {
			const { r, g, b } = color.value.rgb;
			sandbox.console_logs = options.consoleLogs;
			sandbox.world_height = height.value;
			sandbox.world_width = width.value;
			sandbox.gravity_strength = gravity.strength;
			sandbox.gravity_angle = gravity.angle;
			sandbox.color_r = r;
			sandbox.color_g = g;
			sandbox.color_b = b;
		}
	});

	function addCircle(x: number, y: number) {
		if (entities.value >= 15000) return false;
		sandbox?.add_circle(x, y, radius.value);
		entities.value++;
		return true;
	}

	function clearEntities() {
		sandbox?.clear_entities();
		entities.value = 0;
	}

	function draw() {
		if (ctx.value) {
			if (options.clearCanvas) ctx.value.clearRect(0, 0, width.value, height.value);
			sandbox?.draw(ctx.value);
		}
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
		draw,
	};
});
