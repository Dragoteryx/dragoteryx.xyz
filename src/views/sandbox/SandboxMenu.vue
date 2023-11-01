<template>
	<div ref="menu" id="sandbox-menu" class="column spaced padded">
		<div class="row spaced reversed">
			<FormButton icon="pi-forward" class="large blue" @click="sandboxStore.tick">Step</FormButton>
			<FormButton
				:icon="sandboxStore.paused ? 'pi-play' : 'pi-pause'"
				:class="sandboxStore.paused ? 'large blue' : 'large orange'"
				@click="sandboxStore.paused = !sandboxStore.paused"
			>{{ sandboxStore.paused ? "Resume" : "Pause" }}</FormButton>
		</div>
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
	import FormButton from "@/components/form/FormButton.vue";
	import FormColor from "@/components/form/FormColor.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import NavButton from "@/components/NavButton.vue";
	import { useDimensionsStore } from "@/stores/dimensions";
	import { useSandboxStore } from "@/stores/sandbox";
	import { RouterView } from "vue-router";
	import { ref, watchEffect } from "vue";

	const menu = ref<HTMLElement>();
	const sandboxStore = useSandboxStore();
	const dimensionsStore = useDimensionsStore();

	watchEffect(() => {
		dimensionsStore.sandboxMenuWidth = menu.value?.offsetWidth ?? 0;
	});
</script>

<style scoped lang="scss">
	#sandbox-menu {
		width: 250px;
		color: var(--white);
		background: var(--light);
		border-right: 1px solid var(--dark);
	}
</style>