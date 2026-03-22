<template>
	<CanvasMenu
		:controls="sandboxStore.controls"
		v-model:width="sandboxStore.width"
		v-model:height="sandboxStore.height"
		v-model:context2d="sandboxStore.ctx"
		@size-change="sandboxStore.draw"
		@click="sandboxStore.addCircle"
	>
		<NavButton :icon="Shapes" to="/sandbox" highlight="exact">Spawn entities</NavButton>
		<NavButton :icon="Settings" to="/sandbox/settings" highlight="exact">Settings</NavButton>
		<hr />
		<div class="column spaced large">
			<NuxtPage />
		</div>
		<span>Entity count: {{ sandboxStore.entities }}</span>
		<hr />
		<FormRange v-model="sandboxStore.radius" :min="5" :max="45" :reset="15">Radius</FormRange>
		<hr />
		<FormColor
			v-model="sandboxStore.color"
			:mode="sandboxStore.options.colorPicker"
			:reset="sandboxStore.defaultColor"
		/>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import { Shapes, Settings } from "lucide-vue-next";

	const sandboxStore = useSandboxStore();
</script>
