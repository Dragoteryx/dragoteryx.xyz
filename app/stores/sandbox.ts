import { skipHydrate } from "pinia";

export interface Gravity {
	strength: number;
	angle: number;
}

export interface Options {
	drawVolumes: boolean;
	clearCanvas: boolean;
	colorPicker: string;
}

export const useSandboxStore = defineStore("sandbox", () => {
	const sandbox = useWasmModule(module => new module.Sandbox2());
	const entities = ref(0);
	const height = ref(0);
	const width = ref(0);
	const radius = ref(6);
	const bvhDepth = ref(0);
	const defaultColor = new Hsl(90, 50, 50);
	const color = skipHydrate(ref(defaultColor));
	const ctx = ref<CanvasRenderingContext2D>();
	const controls = useTimedControls(60, (paused, dt) => {
		if (!paused) sandbox.value?.update(Math.min(1 / 45, dt), 8);
		bvhDepth.value = sandbox.value?.bvh_depth ?? 0;
		draw();
	});

	const gravity: Gravity = reactive({
		strength: ref(981),
		angle: ref(0),
	});

	const options: Options = reactive({
		drawVolumes: ref(false),
		clearCanvas: ref(true),
		colorPicker: ref("hsl"),
	});

	watchEffect(() => {
		if (sandbox.value) {
			sandbox.value.world_width = width.value;
			sandbox.value.world_height = height.value;
			sandbox.value.draw_volumes = options.drawVolumes;
			sandbox.value.gravity_strength = gravity.strength;
			sandbox.value.gravity_angle = gravity.angle;
		}
	});

	function setColor(color: Color) {
		if (sandbox.value) {
			const rgb = color.rgb;
			sandbox.value.color_r = rgb.r;
			sandbox.value.color_g = rgb.g;
			sandbox.value.color_b = rgb.b;
		}
	}

	function addCircle(x: number, y: number) {
		if (!sandbox.value || entities.value >= 5000) return false;
		setColor(color.value.addLightness(Math.random() * 20 - 10));
		sandbox.value.add_circle(x, y, radius.value);
		entities.value++;
		return true;
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
		bvhDepth,
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
