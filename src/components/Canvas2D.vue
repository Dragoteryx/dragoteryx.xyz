<template>
	<div ref="parent">
		<canvas
			ref="canvas"
			@mouseup="mouseup"
			@mouseleave="mouseup"
			@mousedown="mousedown"
			@mousemove="mousemove"
			@wheel.passive="wheel"
		></canvas>
	</div>
</template>

<script setup lang="ts">
	import { useWindowScroll, useWindowSize } from "@vueuse/core";
	import { useTemplateRef, watchEffect } from "vue";

	const parent = useTemplateRef("parent")
	const canvas = useTemplateRef("canvas");
	const windowScroll = useWindowScroll();
	const windowSize = useWindowSize();

	const width = defineModel("width", {default: 0});
	const height = defineModel("height", {default: 0});
	const context = defineModel<CanvasRenderingContext2D>("context");

	const emit = defineEmits<{
		scroll: [x: number, y: number, up: boolean];
		click: [x: number, y: number];
		drag: [x: number, y: number];
	}>();
	
	watchEffect(() => {
		const ctx = canvas.value?.getContext("2d");
		context.value = ctx ?? undefined;
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

	let mouseState: "up" | "down" | "drag" = "up";

	function mousedown(){
		mouseState = "down";
	}

	function mouseup(event: MouseEvent) {
		if (mouseState == "down") {
			const x = event.x - (canvas.value?.offsetLeft ?? 0) + windowScroll.x.value;
			const y = event.y - (canvas.value?.offsetTop ?? 0) + windowScroll.y.value;
			emit("click", x, y);
		}
		
		mouseState = "up";
	}

	function mousemove(event: MouseEvent) {
		if (mouseState == "down" || mouseState == "drag") {
			emit("drag", -event.movementX, -event.movementY);
			mouseState = "drag";
		}
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