<template>
	<CanvasMenu :controls="sandboxStore.controls" @ready="ready" @resize="resize" @click="sandboxStore.addCircle">
		<NavButton icon="pi-box" to="/sandbox" highlight="exact">Spawn entities</NavButton>
		<NavButton icon="pi-cog" to="/sandbox/settings" highlight="exact">Settings</NavButton>
		<hr>
		<div class="column spaced large">
			<RouterView/>
		</div>
		<span>Entity count: {{ sandboxStore.entities }}</span>
		<hr>
		<FormRange v-model="sandboxStore.radius" :min="5" :max="45" :reset="15">Radius</FormRange>
		<hr>
		<FormColor :color="sandboxStore.color" :reset="{ h: 90, s: 50, l: 50 }"/>
	</CanvasMenu>
</template>

<script setup lang="ts">
	import CanvasMenu from "@/components/CanvasMenu.vue";
	import FormColor from "@/components/form/FormColor.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import NavButton from "@/components/NavButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";
	import { RouterView } from "vue-router";

	const sandboxStore = useSandboxStore();

	function ready(ctx: CanvasRenderingContext2D) {
		sandboxStore.ctx = ctx;
	}

	function resize(w: number, h: number) {
		sandboxStore.width = w;
		sandboxStore.height = h;
	}
</script>