<template>
	<Canvas2D @ready="ready" @resize="resize" @click="sandboxStore.addCircle"/>
</template>

<script setup lang="ts">
	import Canvas2D from "@/components/Canvas2D.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();

	function ready(ctx: CanvasRenderingContext2D) {
		sandboxStore.ctx = ctx;
	}

	function resize(width: number, height: number) {
		sandboxStore.width = width;
		sandboxStore.height = height;
	}
</script>