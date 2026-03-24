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
	useHead({ title: "Boids | dragoteryx.xyz" });

	const boidsStore = useBoidsStore();
</script>
