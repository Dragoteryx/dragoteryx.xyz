<template>
	<CanvasMenu
		v-model:mouse-x="mouseX"
		v-model:mouse-y="mouseY"
		:controls="gameOfLifeStore.controls"
		v-model:context2d="gameOfLifeStore.ctx"
		@size-change="gameOfLifeStore.draw"
		@click="gameOfLifeStore.toggleCell"
		@scroll="scroll"
		@drag="drag"
	>
		<NavButton icon="lucide:dna" to="/game-of-life" highlight="exact">Snapshots</NavButton>
		<NavButton icon="lucide:settings" to="/game-of-life/settings" highlight="exact">Settings</NavButton>
		<hr />
		<FormButton class="red" icon="lucide:skull" @click="gameOfLifeStore.clear">
			Kill {{ gameOfLifeStore.aliveCells }} alive cells
		</FormButton>
		<FormSelect v-model="gameOfLifeStore.rule" :options="options" />
		<hr />
		<div class="flex-1">
			<NuxtPage />
		</div>
		<hr />
		<span v-if="pos">Cursor position: ({{ pos.x }}, {{ pos.y }})</span>
		<span v-else>Cursor position: (-, -)</span>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import type { Option } from "~/components/form/FormSelect.vue";

	const gameOfLifeStore = useGameOfLifeStore();
	const options = computed(() => {
		const options: Option<string>[] = [];
		for (const [key, value] of Object.entries(gameOfLifeStore.rules)) {
			options.push({ description: value[0], value: key });
		}

		return options;
	});

	const mouseX = ref();
	const mouseY = ref();
	const pos = computed(() => {
		if (mouseX.value !== undefined && mouseY.value !== undefined) {
			return gameOfLifeStore.toGameCoordinatesFloored(mouseX.value, mouseY.value);
		}
	});

	function drag(x: number, y: number) {
		gameOfLifeStore.canvasPos.x -= x;
		gameOfLifeStore.canvasPos.y -= y;
	}

	function scroll(x: number, y: number, up: boolean) {
		if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}
	}
</script>
