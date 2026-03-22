<template>
	<span><b>Misc settings</b></span>
	<FormRange :reset="10" :min="1" :max="60" v-model="gameOfLifeStore.speed">Speed</FormRange>
	<FormCheckbox v-model="gameOfLifeStore.debug">Preview next step</FormCheckbox>
</template>

<script setup lang="ts">
	const gameOfLifeStore = useGameOfLifeStore();
</script>
