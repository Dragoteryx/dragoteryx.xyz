<template>
	<CanvasMenu
		:controls="sandboxStore.controls"
		v-model:width="sandboxStore.width"
		v-model:height="sandboxStore.height"
		v-model:context2d="sandboxStore.ctx"
		@size-change="sandboxStore.draw"
		@click="sandboxStore.addCircle"
	>
		<NavButton icon="lucide:shapes" to="/sandbox" highlight="exact">Spawn entities</NavButton>
		<NavButton icon="lucide:settings" to="/sandbox/settings" highlight="exact">Settings</NavButton>
		<hr />
		<div class="flex-1">
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
	const sandboxStore = useSandboxStore();
</script>
