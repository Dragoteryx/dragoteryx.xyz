<template>
	<div class="flex flex-col gap-2">
		<SandboxSpawnButton :amount="10" />
		<SandboxSpawnButton :amount="50" />
		<SandboxSpawnButton :amount="100" />
		<SandboxSpawnButton :amount="500" />
		<SandboxSpawnButton :amount="1000" />
		<SandboxSpawnButton :amount="5000" />
		<SandboxSpawnButton :amount="10000" />
		<FormButton icon="lucide:trash-2" class="red" @click="clear">Clear</FormButton>
	</div>
</template>

<script setup lang="ts">
	useHead({ title: "Sandbox" });

	const sandboxStore = useSandboxStore();

	function clear() {
		sandboxStore.clearEntities();
	}
</script>
