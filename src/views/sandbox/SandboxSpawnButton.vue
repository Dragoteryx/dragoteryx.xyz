<template>
	<FormButton icon="pi-plus" class="green" @click="spawn">Spawn {{ amount }}</FormButton>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	const sandboxStore = useSandboxStore();
	const props = defineProps<{ amount: number }>();

	function spawn() {
		for (let i = 0; i < props.amount; i++) {
			sandboxStore.addCircle(Math.random() * sandboxStore.width, Math.random() * sandboxStore.height);
		}
	}
</script>
