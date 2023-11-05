<template>
	<canvas
		ref="canvas"
		:width="width"
		:height="height"
		@mouseup="mouseup"
		@mousedown="mousedown"
		@mousemove="mousemove"
		@wheel.passive="wheel"
	></canvas>
</template>

<script setup lang="ts">
	import { ref, watchEffect } from "vue";
	import { useWindowScroll } from "@vueuse/core";

	defineProps<{
		width: number;
		height: number;
	}>();

	const canvas = ref<HTMLCanvasElement>();
	const windowScroll = useWindowScroll();
	const emit = defineEmits<{
		ctx: [ctx?: CanvasRenderingContext2D];
		click: [x: number, y: number];
		drag: [x: number, y: number];
		scroll: [up: boolean, x: number, y: number];
	}>();

	watchEffect(() => {
		emit("ctx", canvas.value?.getContext("2d") ?? undefined);
	});

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
	canvas {
		cursor: pointer;
	}
</style>