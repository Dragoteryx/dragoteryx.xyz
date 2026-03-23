<template>
	<FormButton :icon="Plus" class="green" @click="spawn">Spawn {{ amount }}</FormButton>
</template>

<script setup lang="ts">
	import { Plus } from "lucide-vue-next";

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
