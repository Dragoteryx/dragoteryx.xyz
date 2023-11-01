<template>
	<Canvas2D
		:width="sandboxStore.worldWidth"
		:height="sandboxStore.worldHeight"
		@click="sandboxStore.addCircle"
		@ctx="sandboxStore.ctx = $event"
	/>
</template>

<script setup lang="ts">
	import Canvas2D from "@/components/Canvas2D.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();
</script>