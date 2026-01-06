<template>
	<div ref="parent">
		<canvas
			ref="canvas"
			@mouseup="mouseup"
			@mousedown="mousedown"
			@mouseenter="mouseenter"
			@mouseleave="mouseleave"
			@mousemove="mousemove"
			@wheel.passive="wheel"
		></canvas>
	</div>
</template>

<script setup lang="ts">
	import { useWindowScroll, useWindowSize } from "@vueuse/core";
	import { useTemplateRef, watchEffect } from "vue";

	export interface Emits {
		scroll: [x: number, y: number, up: boolean];
		click: [x: number, y: number];
		drag: [x: number, y: number];
	}

	const emit = defineEmits<Emits>();
	const parent = useTemplateRef("parent");
	const canvas = useTemplateRef("canvas");
	const windowScroll = useWindowScroll();
	const windowSize = useWindowSize();

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
		}
	});

	// mouse stuff

	const enum MouseState {
		None,
		Up,
		Down,
		Drag,
	}

	let mouseState = MouseState.None;

	function mouseup(event: MouseEvent) {
		if (mouseState == MouseState.Down) {
			const x = event.x - (canvas.value?.offsetLeft ?? 0) + windowScroll.x.value;
			const y = event.y - (canvas.value?.offsetTop ?? 0) + windowScroll.y.value;
			emit("click", x, y);
		}

		mouseState = MouseState.Up;
	}

	function mousedown() {
		mouseState = MouseState.Down;
	}

	function mouseenter(event: MouseEvent) {
		mouseX.value = event.x - (canvas.value?.offsetLeft ?? 0);
		mouseY.value = event.y - (canvas.value?.offsetTop ?? 0);
		mouseState = MouseState.Up;
	}

	function mousemove(event: MouseEvent) {
		mouseX.value = event.x - (canvas.value?.offsetLeft ?? 0);
		mouseY.value = event.y - (canvas.value?.offsetTop ?? 0);
		if (mouseState == MouseState.Down || mouseState == MouseState.Drag) {
			emit("drag", -event.movementX, -event.movementY);
			mouseState = MouseState.Drag;
		}
	}

	function mouseleave(event: MouseEvent) {
		mouseState = MouseState.None;
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
