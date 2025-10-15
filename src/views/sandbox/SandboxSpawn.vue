<template>
	<SandboxSpawnButton :amount="10" />
	<SandboxSpawnButton :amount="50" />
	<SandboxSpawnButton :amount="100" />
	<SandboxSpawnButton :amount="500" />
	<SandboxSpawnButton :amount="1000" />
	<FormButton icon="pi-trash" class="red" @click="clear">Clear</FormButton>
</template>

<script setup lang="ts">
	import SandboxSpawnButton from "./SandboxSpawnButton.vue";
	import FormButton from "@/components/form/FormButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();

	function clear() {
		sandboxStore.clearEntities();
	}
</script>
