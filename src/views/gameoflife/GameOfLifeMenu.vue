<template>
	<div ref="menu" id="game-of-life-menu" class="row spaced padded">
		<PauseButton class="large" v-model="gameOfLifeStore.paused"/>
		<FormButton class="large" icon="pi-forward" @click="gameOfLifeStore.tick">Next step</FormButton>
		<FormButton class="large red" icon="pi-trash" @click="gameOfLifeStore.clear">Remove {{ gameOfLifeStore.cells }} cells</FormButton>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import PauseButton from "@/components/form/PauseButton.vue";
	import { useDimensionsStore } from "@/stores/dimensions";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import { ref, watchEffect } from "vue";

	const menu = ref<HTMLElement>();
	const gameOfLifeStore = useGameOfLifeStore();
	const dimensionsStore = useDimensionsStore();

	watchEffect(() => {
		dimensionsStore.gameOfLifeMenuHeight = menu.value?.offsetHeight ?? 0;
	});
</script>

<style scoped lang="scss">
	#game-of-life-menu {
		color: var(--white);
		background: var(--light);
		border-top: 1px solid var(--dark);
		padding-left: 25%;
		padding-right: 25%;
	}
</style>