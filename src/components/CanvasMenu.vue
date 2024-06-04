<template>
	<div class="large row">
		<Canvas2D class="large"
			@ready="ctx => emit('ready', ctx)"
			@click="(x, y) => emit('click', x, y)"
			@drag="(x, y) => emit('drag', x, y)"
			@scroll="(x, y, up) => emit('scroll', x, y, up)"
			@resize="(w, h) => emit('resize', w, h)"
		/>
		<div class="column spaced padded menu">
			<ControlsMenu :controls="props.controls"/>
			<hr>
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Canvas2D from "./Canvas2D.vue";
	import ControlsMenu from "./ControlsMenu.vue";
	import type { Controls } from "@/composables/controls";
	import { onMounted, onUnmounted } from "vue";

	const props = defineProps<{
		controls: Controls;
	}>();

	const emit = defineEmits<{
		ready: [ctx: CanvasRenderingContext2D];
		click: [x: number, y: number];
		drag: [x: number, y: number];
		scroll: [up: boolean, x: number, y: number];
		resize: [w: number, h: number];
	}>();

	onMounted(() => {
		props.controls.active = true;
	});

	onUnmounted(() => {
		props.controls.active = false;
	});
</script>

<style scoped lang="scss">
	.menu {
		width: 250px;
		color: var(--white);
		background: var(--light);
		border-left: 1px solid var(--dark);
	}
</style>