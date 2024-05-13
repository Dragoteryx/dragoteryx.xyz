<template>
	<div id="game-of-life-menu" class="column spaced padded">
		<ControlsMenu :controls="gameOfLifeStore.controls"/>
		<hr>
		<FormButton class="red" icon="pi-trash" @click="gameOfLifeStore.clear">Kill {{ gameOfLifeStore.aliveCells }} alive cells</FormButton>
		<hr>
		<FormRange :reset="10" :min="1" :max="60" v-model="gameOfLifeStore.speed">Speed</FormRange>
		<hr>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import ControlsMenu from "@/components/ControlsMenu.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";

	const gameOfLifeStore = useGameOfLifeStore();
</script>

<style scoped lang="scss">
	#game-of-life-menu {
		width: 250px;
		color: var(--white);
		background: var(--light);
		border-left: 1px solid var(--dark);
	}
</style>