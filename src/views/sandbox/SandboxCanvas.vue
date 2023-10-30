<template>
	<canvas ref="canvas" @click="click" :width="sandboxStore.worldWidth" :height="sandboxStore.worldHeight"></canvas>
</template>

<script setup lang="ts">
	import { useDimensionsStore } from "@/stores/dimensions";
	import { useSandboxStore } from "@/stores/sandbox";
	import { onMounted, ref, watchEffect } from "vue";

	const dimensionsStore = useDimensionsStore();
	const sandboxStore = useSandboxStore();
	const canvas = ref<HTMLCanvasElement>();
	const asideMenu = ref<HTMLDivElement>();
	const menu = ref<HTMLDivElement>();

	watchEffect(() => {
		sandboxStore.worldHeight = Math.max(1, dimensionsStore.windowHeight);
	});

	watchEffect(() => {
		sandboxStore.worldWidth = Math.max(1, dimensionsStore.windowWidth - dimensionsStore.asideMenuWidth - dimensionsStore.sandboxMenuWidth);
	});

	watchEffect(() => {
		sandboxStore.ctx = canvas.value?.getContext("2d") ?? undefined;
	});

	onMounted(() => {
		asideMenu.value = document.querySelector("aside") as HTMLDivElement ?? undefined;
		menu.value = document.querySelector("#sandbox-menu") as HTMLDivElement ?? undefined;
	});

	function click(event: MouseEvent) {
		const x = event.x - (canvas.value?.offsetLeft ?? 0);
		const y = event.y - (canvas.value?.offsetTop ?? 0);
		sandboxStore.addCircle(x, y);
	}
</script>