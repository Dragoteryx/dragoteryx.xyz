<template>
	<div class="large row">
		<Canvas2D
			class="large"
			v-model:width="width"
			v-model:height="height"
			v-model:context="context"
			@scroll="(x, y, up) => emit('scroll', x, y, up)"
			@click="(x, y) => emit('click', x, y)"
			@drag="(x, y) => emit('drag', x, y)"
		/>
		<div class="column spaced padded menu">
			<ControlsMenu :controls="props.controls" />
			<hr />
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	import Canvas2D from "./Canvas2D.vue";
	import ControlsMenu from "./ControlsMenu.vue";
	import type { Controls } from "@/composables/controls";
	import { onMounted, onUnmounted } from "vue";

	export interface Props {
		controls: Controls;
	}

	export interface Emits {
		scroll: [x: number, y: number, up: boolean];
		click: [x: number, y: number];
		drag: [x: number, y: number];
	}

	const props = defineProps<Props>();
	const emit = defineEmits<Emits>();
	const width = defineModel("width", { default: 0 });
	const height = defineModel("height", { default: 0 });
	const context = defineModel<CanvasRenderingContext2D>("context");

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
