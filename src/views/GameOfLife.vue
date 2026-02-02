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
		<NavButton :icon="Dna" to="/game-of-life" highlight="exact">Snapshots</NavButton>
		<NavButton :icon="Settings" to="/game-of-life/settings" highlight="exact">Settings</NavButton>
		<hr />
		<FormButton class="red" :icon="Skull" @click="gameOfLifeStore.clear">
			Kill {{ gameOfLifeStore.aliveCells }} alive cells
		</FormButton>
		<FormSelect v-model="gameOfLifeStore.rule" :options="options" />
		<hr />
		<div class="column spaced large">
			<RouterView />
		</div>
		<hr />
		<span v-if="pos">Cursor position: ({{ pos.x }}, {{ pos.y }})</span>
		<span v-else>Cursor position: (-, -)</span>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import FormSelect, { type Option } from "@/components/form/FormSelect.vue";
	import FormButton from "@/components/form/FormButton.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import { Dna, Settings, Skull } from "lucide-vue-next";
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import NavButton from "@/components/NavButton.vue";
	import { RouterView } from "vue-router";
	import { computed, ref } from "vue";

	const gameOfLifeStore = useGameOfLifeStore();
	const options = computed(() => {
		const options: Option<string>[] = [];
		for (const [key, value] of Object.entries(gameOfLifeStore.rules)) {
			options.push({ description: value[0], value: key });
		}

		return options;
	});

	const mouseX = ref(0);
	const mouseY = ref(0);
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
