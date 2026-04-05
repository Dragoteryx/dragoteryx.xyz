<template>
	<FormButton icon="lucide:plus" class="green" @click="spawn">Spawn {{ amount }}</FormButton>
</template>

<script setup lang="ts">
	export interface Props {
		amount: number;
	}

	const props = defineProps<Props>();
	const particlesStore = useParticlesStore();

	function spawn() {
		particlesStore.spawnParticles(props.amount);
	}
</script>
