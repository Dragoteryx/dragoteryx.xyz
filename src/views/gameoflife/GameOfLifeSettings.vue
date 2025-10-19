<template>
	<span><b>Misc settings</b></span>
	<FormRange :reset="10" :min="1" :max="60" v-model="gameOfLifeStore.speed">Speed</FormRange>
	<FormCheckbox v-model="gameOfLifeStore.debug">Preview next step</FormCheckbox>
</template>

<script setup lang="ts">
	import FormCheckbox from "@/components/form/FormCheckbox.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import { useGameOfLifeStore } from "@/stores/gameoflife";

	const gameOfLifeStore = useGameOfLifeStore();
</script>
