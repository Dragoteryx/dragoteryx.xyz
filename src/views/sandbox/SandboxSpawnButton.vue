<template>
	<FormButton icon="plus" class="green" @click="spawn">Spawn {{ amount }}</FormButton>
</template>

<script setup lang="ts">
	import FormButton from "@/components/form/FormButton.vue";
	import { useSandboxStore } from "@/stores/sandbox";

	export interface Props {
		amount: number;
	}

	const props = defineProps<Props>();
	const sandboxStore = useSandboxStore();

	function spawn() {
		for (let i = 0; i < props.amount; i++) {
			if (!sandboxStore.addCircle(Math.random() * sandboxStore.width, Math.random() * sandboxStore.height)) break;
		}
	}
</script>
