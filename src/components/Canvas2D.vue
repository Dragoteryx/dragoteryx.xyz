<template>
	<div ref="parent">
		<canvas
			ref="canvas"
			:width="size.width"
			:height="size.height"
			@mouseup="mouseup"
			@mouseleave="mouseup"
			@mousedown="mousedown"
			@mousemove="mousemove"
			@wheel.passive="wheel"
		></canvas>
	</div>
</template>

<script setup lang="ts">
	import { useElementSize, useWindowScroll } from "@vueuse/core";
	import { reactive, ref, watchEffect } from "vue";

	const parent = ref<HTMLDivElement>();
	const canvas = ref<HTMLCanvasElement>();
	const windowScroll = useWindowScroll();
	const size = reactive(useElementSize(parent));

	const emit = defineEmits<{
		ready: [ctx: CanvasRenderingContext2D];
		click: [x: number, y: number];
		drag: [x: number, y: number];
		scroll: [up: boolean, x: number, y: number];
		resize: [width: number, height: number];
	}>();
	
	watchEffect(() => {
		const ctx = canvas.value?.getContext("2d");
		if (ctx) emit("ready", ctx);
	});

	watchEffect(() => {
		emit("resize", size.width, size.height);
	});

	// mouse stuff

	let mouseState: "up" | "down" | "drag" = "up";

	function mousedown(event: MouseEvent){
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
			emit("drag", event.movementX, event.movementY);
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