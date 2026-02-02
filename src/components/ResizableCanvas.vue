<template>
	<div ref="parent">
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
	import { ref, useTemplateRef, watchEffect } from "vue";
	import { useWindowSize } from "@vueuse/core";

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

	const emit = defineEmits<Emits>();
	const parent = useTemplateRef("parent");
	const canvas = useTemplateRef("canvas");
	const windowSize = useWindowSize();

	const mouseState = ref(MouseState.Up);
	const mouseX = defineModel<number>("mouseX");
	const mouseY = defineModel<number>("mouseY");
	const width = defineModel<number>("width");
	const height = defineModel<number>("height");
	const context2d = defineModel<CanvasRenderingContext2D>("context2d");

	watchEffect(() => {
		const ctx = canvas.value?.getContext("2d");
		context2d.value = ctx ?? undefined;
	});

	watchEffect(() => {
		if (parent.value && canvas.value) {
			windowSize.height.value;
			windowSize.width.value;
			canvas.value.width = 1;
			canvas.value.height = 1;
			canvas.value.width = parent.value.clientWidth;
			canvas.value.height = parent.value.clientHeight;
			height.value = canvas.value.height;
			width.value = canvas.value.width;
			emit("sizeChange", width.value, height.value);
		}
	});

	function mouseUp(event: MouseEvent) {
		if (mouseState.value == MouseState.Down) {
			const x = event.x - (canvas.value?.offsetLeft ?? 0);
			const y = event.y - (canvas.value?.offsetTop ?? 0);
			emit("click", x, y);
		}

		mouseState.value = MouseState.Up;
	}

	function mouseDown() {
		mouseState.value = MouseState.Down;
	}

	function mouseEnter(event: MouseEvent) {
		mouseX.value = event.x - (canvas.value?.offsetLeft ?? 0);
		mouseY.value = event.y - (canvas.value?.offsetTop ?? 0);
		mouseState.value = MouseState.Up;
	}

	function mouseMove(event: MouseEvent) {
		mouseX.value = event.x - (canvas.value?.offsetLeft ?? 0);
		mouseY.value = event.y - (canvas.value?.offsetTop ?? 0);
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
		const x = event.x - (canvas.value?.offsetLeft ?? 0);
		const y = event.y - (canvas.value?.offsetTop ?? 0);
		emit("scroll", x, y, event.deltaY < 0);
	}
</script>

<style scoped lang="scss">
	div {
		line-height: 0;
	}

	canvas {
		cursor: pointer;
	}
</style>
