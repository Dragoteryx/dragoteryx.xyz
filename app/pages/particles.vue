<template>
	<CanvasMenu
		mode="webgpu"
		:controls="sandboxStore.controls"
		v-model:context-gpu="sandboxStore.ctx"
		v-model:height="sandboxStore.bounds.height"
		v-model:width="sandboxStore.bounds.width"
		@click="click"
	>
		<NavButton icon="lucide:circle-pile" to="/particles" highlight="exact">Spawn particles</NavButton>
		<NavButton icon="lucide:settings" to="/particles/settings" highlight="exact">Settings</NavButton>
		<hr />
		<div class="flex-1">
			<NuxtPage />
		</div>
		<span>Particle count: {{ sandboxStore.particleCount }}</span>
		<hr />
		<FormRange v-model="sandboxStore.radius" :min="3" :max="60" :reset="6" :range-size="1">Radius</FormRange>
		<hr />
		<FormColor v-model="sandboxStore.color" :mode="sandboxStore.options.colorPicker" :reset="DEFAULT_COLOR" />
	</CanvasMenu>
</template>

<script setup lang="ts">
	import { DEFAULT_COLOR } from "@/stores/particles";

	const sandboxStore = useParticlesStore();

	function click(x: number, y: number) {
		sandboxStore.spawnParticle(x, y);
	}
</script>
