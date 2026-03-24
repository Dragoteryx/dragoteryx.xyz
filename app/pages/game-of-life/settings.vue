<template>
	<div class="flex flex-col gap-2">
		<span><b>Misc settings</b></span>
		<FormRange v-model="gameOfLifeStore.speed" :min="1" :max="60" :reset="10">Speed</FormRange>
		<FormCheckbox v-model="gameOfLifeStore.debug">Preview next step</FormCheckbox>
	</div>
</template>

<script setup lang="ts">
	useHead({ title: "Game of Life/Settings" });

	const gameOfLifeStore = useGameOfLifeStore();
</script>
