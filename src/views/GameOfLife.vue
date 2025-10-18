<template>
	<CanvasMenu
		v-model:mouse-x="mouseX"
		v-model:mouse-y="mouseY"
		:controls="gameOfLifeStore.controls"
		v-model:context="gameOfLifeStore.ctx"
		@click="gameOfLifeStore.toggleCell"
		@scroll="scroll"
		@drag="drag"
	>
		<FormButton class="red" :icon="Skull" @click="gameOfLifeStore.clear">
			Kill {{ gameOfLifeStore.aliveCells }} alive cells
		</FormButton>
		<hr />
		<FormRange :reset="10" :min="1" :max="60" v-model="gameOfLifeStore.speed">Speed</FormRange>
		<hr />
		<div class="column spaced large">
			<label class="column spaced">
				<span class="large">Rule</span>
				<FormSelect v-model="gameOfLifeStore.rule" :options="options" />
			</label>
		</div>
		<hr />
		<span v-if="pos">Cursor position: ({{ pos.x }}, {{ pos.y }})</span>
		<span v-else>Cursor position: (-, -)</span>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import FormSelect, { type Option } from "@/components/form/FormSelect.vue";
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import FormButton from "@/components/form/FormButton.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import { Skull } from "lucide-vue-next";
	import { computed } from "vue";

	const gameOfLifeStore = useGameOfLifeStore();
	const options = computed(() => {
		const options: Option<string>[] = [];
		for (const [key, value] of Object.entries(gameOfLifeStore.rules)) {
			options.push({ description: value.description, value: key });
		}

		return options;
	});

	const mouseX = defineModel<number>("mouseX");
	const mouseY = defineModel<number>("mouseY");
	const pos = computed(() => {
		if (mouseX.value !== undefined && mouseY.value !== undefined) {
			return gameOfLifeStore.toGameCoordinatesFloored(mouseX.value, mouseY.value);
		}
	});

	function drag(x: number, y: number) {
		gameOfLifeStore.canvasPos.x += x;
		gameOfLifeStore.canvasPos.y += y;
	}

	function scroll(x: number, y: number, up: boolean) {
		if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}
	}
</script>
