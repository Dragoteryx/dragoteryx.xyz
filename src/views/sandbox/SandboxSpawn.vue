<template>
	<FormButton text="Spawn 10" icon="pi-plus" class="green" @click="spawn(10)"/>
	<FormButton text="Spawn 50" icon="pi-plus" class="green" @click="spawn(50)"/>
	<FormButton text="Spawn 100" icon="pi-plus" class="green" @click="spawn(100)"/>
	<FormButton text="Spawn 500" icon="pi-plus" class="green" @click="spawn(500)"/>
	<FormButton text="Spawn 1000" icon="pi-plus" class="green" @click="spawn(1000)"/>
	<FormButton text="Clear" icon="pi-trash" class="red" @click="clear"/>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();

	function spawn(amount: number) {
		for (let i = 0; i < amount; i++) {
			sandboxStore.addCircle(
				Math.random() * sandboxStore.worldWidth,
				Math.random() * sandboxStore.worldHeight,
			);
		}
	}

	function clear() {
		sandboxStore.clearEntities();
	}
</script>