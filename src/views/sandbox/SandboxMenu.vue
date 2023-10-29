<template>
	<div ref="menu" id="sandbox-menu" class="column spaced padded">
		<div class="row spaced">
			<FormButton :class="sandboxStore.paused ? 'large blue' : 'large orange'" @click="sandboxStore.paused = !sandboxStore.paused">
				{{ sandboxStore.paused ? 'Resume' : 'Pause' }}
			</FormButton>
			<FormButton class="large" @click="sandboxStore.tick">Step</FormButton>
		</div>
		<hr>
		<NavButton to="/sandbox" highlight="exact">Spawn entities</NavButton>
		<NavButton to="/sandbox/settings" highlight="exact">Settings</NavButton>
		<hr>
		<div class="column spaced large">
			<RouterView/>
		</div>
		<span>Entity count: {{ sandboxStore.entities }}</span>
		<hr>
		<FormRange v-model="sandboxStore.radius" :min="5" :max="45" :reset="15">Radius</FormRange>
		<hr>
		<FormColor :color="sandboxStore.color" :reset="{ h: 90, s: 50, l: 50 }"/>
		<hr>
		<div class="column spaced">
			<FormCheckbox v-model="sandboxStore.clearCanvas">Clear previous frame</FormCheckbox>
			<FormCheckbox v-if="isDev" v-model="sandboxStore.debug">Debug</FormCheckbox>
		</div>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import FormColor from "@/components/form/FormColor.vue";
	import FormCheckbox from "@/components/form/FormCheckbox.vue";
	import FormRange from "@/components/form/FormRange.vue";
	import NavButton from "@/components/NavButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";
	import { RouterView } from "vue-router";
	import { ref, watchEffect } from "vue";

	const menu = ref<HTMLDivElement>();
	const sandboxStore = useSandboxStore();
	const isDev = import.meta.env.DEV;

	watchEffect(() => {
		sandboxStore.menuWidth = menu.value?.offsetWidth ?? Infinity;
	});
</script>

<style scoped lang="scss">
	#sandbox-menu {
		width: 250px;
		color: var(--white);
		background: var(--light);
	}
</style>