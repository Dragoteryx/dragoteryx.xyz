import { useIntervalFn, useLocalStorage, useWindowSize } from "@vueuse/core";
import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { useMiscStore } from "./misc";
import { Phys } from "@/wasm/pkg";

export const useSandboxStore = defineStore("sandbox", () => {
	const ctx = ref<CanvasRenderingContext2D>();
	const controls = useIntervalFn(update, 1000/60);
	const entities = ref(0);
	const phys = new Phys();

	const debug = useLocalStorage("sandbox-debug", false);
	const paused = useLocalStorage("sandbox-paused", false);
	const radius = useLocalStorage("sandbox-radius", 15);
	const gravityStrenth = useLocalStorage("sandbox-gravity-strength", 981);
	const gravityAngle = useLocalStorage("sandbox-gravity-angle", 0);
	const clearCanvas = useLocalStorage("sandbox-clear-canvas", true);
	const color = ref({
		h: useLocalStorage("sandbox-color-h", 90),
		s: useLocalStorage("sandbox-color-s", 50),
		l: useLocalStorage("sandbox-color-l", 50)
	});

	const menuWidth = ref(Infinity);
	const miscStore = useMiscStore();
	const windowSize = useWindowSize();
	const height = computed(() => Math.max(0, windowSize.height.value));
	const width = computed(() => Math.max(0, windowSize.width.value - (miscStore.asideWidth + menuWidth.value)));

	watchEffect(() => phys.debug = debug.value);
	watchEffect(() => phys.world_height = height.value);
	watchEffect(() => phys.world_width = width.value);
	watchEffect(() => phys.gravity_strength = gravityStrenth.value);
	watchEffect(() => phys.gravity_angle = gravityAngle.value);
	watchEffect(() => phys.color_h = color.value.h);
	watchEffect(() => phys.color_s = color.value.s);
	watchEffect(() => phys.color_l = color.value.l);
	
	function update() {
		if (!paused.value) tick();
		if (ctx.value) {
			if (clearCanvas.value)
				ctx.value.clearRect(0, 0, width.value, height.value);
			phys.draw(ctx.value);
		}
	}

	function tick() {
		phys.tick();
	}

	function addCircle(x: number, y: number) {
		phys.add_circle(x, y, radius.value);
		entities.value++;
	}

	function clearEntities() {
		phys.clear_entities();
		entities.value = 0;
	}

	return {
		ctx, clearCanvas,
		menuWidth, height, width,
		entities, tick, addCircle,
		clearEntities,
		controls, paused, color,
		radius, gravityStrenth, gravityAngle,
		debug,
	};
});