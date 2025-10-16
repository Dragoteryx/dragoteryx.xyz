<template>
	<SandboxSpawnButton :amount="10" />
	<SandboxSpawnButton :amount="50" />
	<SandboxSpawnButton :amount="100" />
	<SandboxSpawnButton :amount="500" />
	<SandboxSpawnButton :amount="1000" />
	<SandboxSpawnButton :amount="5000" />
	<SandboxSpawnButton :amount="10000" />
	<FormButton :icon="Trash2" class="red" @click="clear">Clear</FormButton>
</template>

<script setup lang="ts">
	import SandboxSpawnButton from "./SandboxSpawnButton.vue";
	import FormButton from "@/components/form/FormButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";
	import { Trash2 } from "lucide-vue-next";

	const sandboxStore = useSandboxStore();

	function clear() {
		sandboxStore.clearEntities();
	}
</script>
