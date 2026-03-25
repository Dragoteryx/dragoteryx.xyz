import { skipHydrate } from "pinia";

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
	const sandbox = useWasmModule(module => new module.Sandbox());
	const entities = ref(0);
	const height = ref(0);
	const width = ref(0);
	const radius = ref(5);
	const defaultColor = new Hsl(90, 50, 50);
	const color = skipHydrate(ref(defaultColor));
	const ctx = ref<CanvasRenderingContext2D>();
	const controls = useTimedControls(60, (paused, dt) => {
		if (!paused) sandbox.value?.tick(Math.min(1 / 45, dt));
		draw();
	});

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
		if (sandbox.value) {
			const { r, g, b } = color.value.rgb;
			sandbox.value.console_logs = options.consoleLogs;
			sandbox.value.world_height = height.value;
			sandbox.value.world_width = width.value;
			sandbox.value.gravity_strength = gravity.strength;
			sandbox.value.gravity_angle = gravity.angle;
			sandbox.value.color_r = r;
			sandbox.value.color_g = g;
			sandbox.value.color_b = b;
		}
	});

	function addCircle(x: number, y: number) {
		if (sandbox.value) {
			if (entities.value >= 15000) return false;
			sandbox.value.add_circle(x, y, radius.value);
			entities.value++;
			return true;
		}
	}

	function clearEntities() {
		sandbox.value?.clear_entities();
		entities.value = 0;
	}

	function draw() {
		if (sandbox.value && ctx.value) {
			if (options.clearCanvas) ctx.value.clearRect(0, 0, width.value, height.value);
			sandbox.value.draw(ctx.value);
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
