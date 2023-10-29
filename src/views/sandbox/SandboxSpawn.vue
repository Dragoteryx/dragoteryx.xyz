<template>
	<div class="column spaced">
		<FormButton class="green" @click="spawn(1)">Spawn 1</FormButton>
		<FormButton class="green" @click="spawn(5)">Spawn 5</FormButton>
		<FormButton class="green" @click="spawn(10)">Spawn 10</FormButton>
		<FormButton class="green" @click="spawn(50)">Spawn 50</FormButton>
		<FormButton class="green" @click="spawn(100)">Spawn 100</FormButton>
		<FormButton class="green" @click="spawn(500)">Spawn 500</FormButton>
		<FormButton class="green" @click="spawn(1000)">Spawn 1000</FormButton>
		<FormButton class="red" @click="clear">Clear</FormButton>
	</div>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();

	function spawn(amount: number) {
		for (let i = 0; i < amount; i++) {
			sandboxStore.addCircle(
				Math.random() * sandboxStore.width,
				Math.random() * sandboxStore.height,
			);
		}
	}

	function clear() {
		sandboxStore.clearEntities();
	}
</script>