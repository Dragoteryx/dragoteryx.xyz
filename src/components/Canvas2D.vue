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
	import { ref, watchEffect } from "vue";

	const parent = ref<HTMLDivElement>();
	const canvas = ref<HTMLCanvasElement>();
	const windowScroll = useWindowScroll();
	const windowSize = useWindowSize();

	const emit = defineEmits<{
		ready: [ctx: CanvasRenderingContext2D];
		click: [x: number, y: number];
		drag: [x: number, y: number];
		scroll: [up: boolean, x: number, y: number];
		resize: [w: number, h: number];
	}>();
	
	watchEffect(() => {
		const ctx = canvas.value?.getContext("2d");
		if (ctx) emit("ready", ctx);
	});

	watchEffect(() => {
		if (parent.value && canvas.value) {
			windowSize.height.value;
			windowSize.width.value;
			canvas.value.width = 1;
			canvas.value.height = 1;
			canvas.value.width = parent.value.clientWidth;
			canvas.value.height = parent.value.clientHeight;
			emit("resize", canvas.value.width, canvas.value.height);
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
		emit("scroll", event.deltaY < 0, x, y);
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