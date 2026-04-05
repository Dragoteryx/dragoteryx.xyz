<template>
	<div class="flex flex-col gap-2">
		<ParticlesSpawnButton :amount="10" />
		<ParticlesSpawnButton :amount="50" />
		<ParticlesSpawnButton :amount="100" />
		<ParticlesSpawnButton :amount="500" />
		<ParticlesSpawnButton :amount="1000" />
		<ParticlesSpawnButton :amount="5000" />
		<FormButton icon="lucide:trash-2" class="red" @click="clear">Clear</FormButton>
	</div>
</template>

<script setup lang="ts">
	useHead({ title: "Sandbox" });

	const particlesStore = useParticlesStore();

	function clear() {
		particlesStore.clearParticles();
	}
</script>
