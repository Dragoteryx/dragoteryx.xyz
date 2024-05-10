<template>
	<div id="sandbox-menu" class="column spaced padded">
		<PauseMenu v-model="sandboxStore.controls.paused" @tick="sandboxStore.controls.tick"/>
		<hr>
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
	</div>
</template>

<script setup lang="ts">
	import FormColor from "@/components/form/FormColor.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import NavButton from "@/components/NavButton.vue";
	import PauseMenu from "@/components/PauseMenu.vue";
	import { useSandboxStore } from "@/stores/sandbox";
	import { RouterView } from "vue-router";

	const sandboxStore = useSandboxStore();
</script>

<style scoped lang="scss">
	#sandbox-menu {
		width: 250px;
		color: var(--white);
		background: var(--light);
		border-left: 1px solid var(--dark);
	}
</style>