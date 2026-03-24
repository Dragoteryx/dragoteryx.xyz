<template>
	<div class="flex flex-col gap-2">
		<span><b>Misc settings</b></span>
		<FormRange :reset="10" :min="1" :max="60" :range-size="1" v-model="gameOfLifeStore.speed">Speed</FormRange>
		<FormCheckbox v-model="gameOfLifeStore.debug">Preview next step</FormCheckbox>
	</div>
</template>

<script setup lang="ts">
	const gameOfLifeStore = useGameOfLifeStore();
</script>
