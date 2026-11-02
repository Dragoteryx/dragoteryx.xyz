<template>
	<div ref="parent" class="flex-1">
		<canvas
			ref="canvas"
			@mouseup="mouseUp"
			@mousedown="mouseDown"
			@mouseenter="mouseEnter"
			@mouseleave="mouseLeave"
			@mousemove="mouseMove"
			@wheel.passive="wheel"
		></canvas>
	</div>
</template>

<script setup lang="ts">
	export interface Props {
		mode: "canvas2d" | "webgpu";
	}

	export interface Emits {
		sizeChange: [width: number, height: number];
		scroll: [x: number, y: number, up: boolean];
		click: [x: number, y: number];
		drag: [x: number, y: number];
	}

	const enum MouseState {
		Up,
		Down,
		Drag,
	}

	const props = defineProps<Props>();
	const emit = defineEmits<Emits>();
	const parent = useTemplateRef("parent");
	const canvas = useTemplateRef("canvas");
	const parentBounding = useElementBounding(parent);

	const mouseState = ref(MouseState.Up);
	const mouseX = defineModel<number>("mouseX");
	const mouseY = defineModel<number>("mouseY");
	const width = defineModel<number>("width");
	const height = defineModel<number>("height");
	const context2d = defineModel<CanvasRenderingContext2D>("context2d");
	const contextGpu = defineModel<GPUCanvasContext>("contextGpu");

	watchEffect(() => {
		if (canvas.value) {
			if (props.mode == "canvas2d") {
				const ctx2d = canvas.value.getContext("2d");
				context2d.value = ctx2d ?? undefined;
			} else if (props.mode == "webgpu") {
				const ctxGpu = canvas.value.getContext("webgpu");
				contextGpu.value = ctxGpu ?? undefined;
			}
		}
	});

	watchEffect(() => {
		if (parent.value && canvas.value) {
			let oldHeight = canvas.value.height;
			let oldWidth = canvas.value.width;
			height.value = parentBounding.height.value;
			width.value = parentBounding.width.value;
			canvas.value.width = parentBounding.width.value;
			canvas.value.height = parentBounding.height.value;
			if (oldHeight != canvas.value.height || oldWidth != canvas.value.width) {
				emit("sizeChange", width.value, height.value);
			}
		}
	});

	function mouseUp(event: MouseEvent) {
		if (mouseState.value == MouseState.Down) {
			const x = event.x - parentBounding.x.value;
			const y = event.y - parentBounding.y.value;
			emit("click", x, y);
		}

		mouseState.value = MouseState.Up;
	}

	function mouseDown() {
		mouseState.value = MouseState.Down;
	}

	function mouseEnter(event: MouseEvent) {
		mouseX.value = event.x - parentBounding.x.value;
		mouseY.value = event.y - parentBounding.y.value;
		mouseState.value = MouseState.Up;
	}

	function mouseMove(event: MouseEvent) {
		mouseX.value = event.x - parentBounding.x.value;
		mouseY.value = event.y - parentBounding.y.value;
		if (mouseState.value != MouseState.Up) {
			emit("drag", event.movementX, event.movementY);
			mouseState.value = MouseState.Drag;
		}
	}

	function mouseLeave(event: MouseEvent) {
		mouseState.value = MouseState.Up;
		mouseX.value = undefined;
		mouseY.value = undefined;
	}

	function wheel(event: WheelEvent) {
		const x = event.x - parentBounding.x.value;
		const y = event.y - parentBounding.y.value;
		emit("scroll", x, y, event.deltaY < 0);
	}
</script>

<style scoped>
	div {
		line-height: 0;
	}

	canvas {
		cursor: pointer;
		position: absolute;
		background: var(--ui-canvas-color);
	}
</style>
