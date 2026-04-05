<template>
	<CanvasMenu
		mode="webgpu"
		:controls="particlesStore.controls"
		v-model:context-gpu="particlesStore.ctx"
		v-model:height="particlesStore.bounds.height"
		v-model:width="particlesStore.bounds.width"
		@click="click"
	>
		<NavButton icon="lucide:circle-pile" to="/particles" highlight="exact">Spawn particles</NavButton>
		<NavButton icon="lucide:settings" to="/particles/settings" highlight="exact">Settings</NavButton>
		<hr />
		<div class="flex-1">
			<NuxtPage />
		</div>
		<span>Particle count: {{ particlesStore.particleCount }}</span>
		<hr />
		<FormRange v-model="particlesStore.radius" :min="3" :max="60" :reset="6" :range-size="1">Radius</FormRange>
		<hr />
		<FormColor v-model="particlesStore.color" :mode="particlesStore.options.colorPicker" :reset="DEFAULT_COLOR" />
	</CanvasMenu>
</template>

<script setup lang="ts">
	import { DEFAULT_COLOR } from "@/stores/particles";

	const particlesStore = useParticlesStore();

	function click(x: number, y: number) {
		particlesStore.spawnParticle(x, y);
	}
</script>
