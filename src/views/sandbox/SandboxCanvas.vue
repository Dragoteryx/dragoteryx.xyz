<template>
	<canvas
		ref="canvas"
		:width="sandboxStore.worldWidth"
		:height="sandboxStore.worldHeight"
		@click="click"
	></canvas>
</template>

<script setup lang="ts">
	import { useDimensionsStore } from "@/stores/dimensions";
	import { useSandboxStore } from "@/stores/sandbox";
	import { ref, watchEffect } from "vue";

	const canvas = ref<HTMLCanvasElement>();
	const sandboxStore = useSandboxStore();
	const dimensionsStore = useDimensionsStore();

	watchEffect(() => {
		sandboxStore.worldHeight = Math.max(1, dimensionsStore.windowHeight);
	});

	watchEffect(() => {
		sandboxStore.worldWidth = Math.max(1, dimensionsStore.windowWidth - dimensionsStore.asideMenuWidth - dimensionsStore.sandboxMenuWidth);
	});

	watchEffect(() => {
		sandboxStore.ctx = canvas.value?.getContext("2d") ?? undefined;
	});

	function click(event: MouseEvent) {
		const x = event.x - (canvas.value?.offsetLeft ?? 0);
		const y = event.y - (canvas.value?.offsetTop ?? 0);
		sandboxStore.addCircle(x, y);
	}
</script>