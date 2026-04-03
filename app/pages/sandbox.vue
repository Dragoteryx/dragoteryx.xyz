<template>
	<CanvasMenu
		mode="webgpu"
		:controls="sandboxStore.controls"
		v-model:context-gpu="sandboxStore.ctx"
		v-model:height="sandboxStore.bounds.height"
		v-model:width="sandboxStore.bounds.width"
		@click="click"
	>
		<NavButton icon="lucide:shapes" to="/sandbox" highlight="exact">Spawn entities</NavButton>
		<NavButton icon="lucide:settings" to="/sandbox/settings" highlight="exact">Settings</NavButton>
		<hr />
		<div class="flex-1">
			<NuxtPage />
		</div>
		<span>Entity count: {{ sandboxStore.entityCount }}</span>
		<hr />
		<FormRange v-model="sandboxStore.radius" :min="3" :max="60" :reset="6" :range-size="1">Radius</FormRange>
		<hr />
		<FormColor v-model="sandboxStore.color" :mode="sandboxStore.options.colorPicker" :reset="DEFAULT_COLOR" />
	</CanvasMenu>
</template>

<script setup lang="ts">
	import { DEFAULT_COLOR } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();

	function click(x: number, y: number) {
		sandboxStore.spawnEntity(x, y);
	}
</script>
