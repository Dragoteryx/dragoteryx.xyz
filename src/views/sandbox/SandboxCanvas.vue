<template>
	<canvas ref="canvas" @click="click" :width="sandboxStore.width" :height="sandboxStore.height"></canvas>
</template>

<script setup lang="ts">
	import { useSandboxStore } from "@/stores/sandbox";
	import { useMiscStore } from "@/stores/misc";
	import { ref, watchEffect } from "vue";

	const miscStore = useMiscStore();
	const sandboxStore = useSandboxStore();
	const canvas = ref<HTMLCanvasElement>();

	watchEffect(() => {
		sandboxStore.ctx = canvas.value?.getContext("2d") ?? undefined;
	});

	function click(event: MouseEvent) {
		const x = event.x - miscStore.asideWidth;
		const y = event.y;

		sandboxStore.addCircle(x, y);
	}
</script>