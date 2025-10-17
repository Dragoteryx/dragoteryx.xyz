<template>
	<CanvasMenu
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
		<label class="column spaced">
			<span class="large">Rule</span>
			<FormSelect v-model="gameOfLifeStore.rule" :options="options" />
		</label>
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

	function drag(x: number, y: number) {
		gameOfLifeStore.pos.x += x;
		gameOfLifeStore.pos.y += y;
	}

	function scroll(x: number, y: number, up: boolean) {
		if (up) {
			gameOfLifeStore.zoomIn(x, y);
		} else {
			gameOfLifeStore.zoomOut(x, y);
		}
	}
</script>
