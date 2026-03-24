<template>
	<div class="flex flex-row flex-1">
		<ResizableCanvas
			class="flex-1"
			v-model:mouse-x="mouseX"
			v-model:mouse-y="mouseY"
			v-model:width="width"
			v-model:height="height"
			v-model:context2d="context2d"
			@size-change="(w, h) => emit('sizeChange', w, h)"
			@scroll="(x, y, up) => emit('scroll', x, y, up)"
			@click="(x, y) => emit('click', x, y)"
			@drag="(x, y) => emit('drag', x, y)"
		/>
		<div class="flex flex-col gap-2 px-4 py-2 menu">
			<ControlsMenu :controls="controls" />
			<hr />
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { Emits } from "./ResizableCanvas.vue";

	export interface Props {
		controls: Controls;
	}

	const props = defineProps<Props>();
	const emit = defineEmits<Emits>();
	const mouseX = defineModel<number>("mouseX");
	const mouseY = defineModel<number>("mouseY");
	const width = defineModel("width", { default: 0 });
	const height = defineModel("height", { default: 0 });
	const context2d = defineModel<CanvasRenderingContext2D>("context2d");

	onMounted(() => {
		props.controls.active = true;
	});

	onUnmounted(() => {
		props.controls.active = false;
	});
</script>

<style scoped lang="scss">
	.menu {
		width: 16rem;
		color: var(--white);
		background: var(--light);
		border-left: 1px solid var(--dark);
	}
</style>
