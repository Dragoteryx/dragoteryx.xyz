<template>
	<canvas ref="canvas" :width="width" :height="height" v-mouse-interactions></canvas>
</template>

<script setup lang="ts">
	import { useMouseInteractions } from "@/composables/mouse";
	import { ref, watchEffect } from "vue";

	defineProps<{
		width: number;
		height: number;
	}>();

	const canvas = ref<HTMLCanvasElement>();

	const emit = defineEmits<{
		ctx: [ctx?: CanvasRenderingContext2D];
		click: [x: number, y: number];
		drag: [x: number, y: number];
		scroll: [up: boolean, x: number, y: number];
	}>();

	const vMouseInteractions = useMouseInteractions({
		scroll: (up, x, y) => emit("scroll", up, x, y),
		click: (x, y) => emit("click", x, y),
		drag: (x, y) => emit("drag", x, y),
	});

	watchEffect(() => {
		emit("ctx", canvas.value?.getContext("2d") ?? undefined);
	});
</script>

<style scoped lang="scss">
	canvas {
		cursor: pointer;
	}
</style>