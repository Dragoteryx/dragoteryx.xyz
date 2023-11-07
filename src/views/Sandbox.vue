<template>
	<div id="sandbox" class="large row">
		<SandboxCanvas class="large"/>
		<SandboxMenu/>
	</div>
</template>

<script setup lang="ts">
	import SandboxCanvas from "./sandbox/SandboxCanvas.vue";
	import SandboxMenu from "./sandbox/SandboxMenu.vue";
	import { useSandboxStore } from "@/stores/sandbox";
	import { onMounted, onUnmounted } from "vue";

	const sandboxStore = useSandboxStore();

	onMounted(() => {
		sandboxStore.controls.resume();
	});

	onUnmounted(() => {
		sandboxStore.controls.pause();
	});
</script>