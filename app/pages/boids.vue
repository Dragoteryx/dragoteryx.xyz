<template>
	<CanvasMenu
		:controls="boidsStore.controls"
		v-model:width="boidsStore.width"
		v-model:height="boidsStore.height"
		v-model:context2d="boidsStore.ctx"
	>
	</CanvasMenu>
</template>

<script setup lang="ts">
	const boidsStore = useBoidsStore();
</script>
