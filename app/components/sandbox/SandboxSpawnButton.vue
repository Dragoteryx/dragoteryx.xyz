<template>
	<FormButton icon="lucide:plus" class="green" @click="spawn">Spawn {{ amount }}</FormButton>
</template>

<script setup lang="ts">
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
