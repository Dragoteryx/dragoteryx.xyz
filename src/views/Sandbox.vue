<template>
	<CanvasMenu
		:controls="sandboxStore.controls"
		v-model:width="sandboxStore.width"
		v-model:height="sandboxStore.height"
		v-model:context2d="sandboxStore.ctx"
		@click="sandboxStore.addCircle"
	>
		<NavButton :icon="Shapes" to="/sandbox" highlight="exact">Spawn entities</NavButton>
		<NavButton :icon="Settings" to="/sandbox/settings" highlight="exact">Settings</NavButton>
		<hr />
		<div class="column spaced large">
			<RouterView />
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
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import FormColor from "@/components/form/FormColor.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import NavButton from "@/components/NavButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";
	import { Shapes, Settings } from "lucide-vue-next";
	import { RouterView } from "vue-router";

	const sandboxStore = useSandboxStore();
</script>
