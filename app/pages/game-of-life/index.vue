<template>
	<FormButton class="orange" icon="lucide:clipboard-x" @click="clearSnapshots()">Clear snapshots</FormButton>
	<FormButton class="blue" icon="lucide:clipboard-plus" @click="createSnapshot()" :disabled="!trimmed">
		Create snapshot
	</FormButton>
	<FormText v-model="name" placeholder="Snapshot name" @submit="createSnapshot()" />
	<hr />
	<ul>
		<li v-for="[name, _] in gameOfLifeStore.snapshots" class="row spaced">
			<span class="large">{{ name }}</span>
			<FormButton class="green" icon="lucide:clipboard-paste" @click="gameOfLifeStore.loadSnapshot(name)" />
			<FormButton class="red" icon="lucide:clipboard-minus" @click="gameOfLifeStore.removeSnapshot(name)" />
		</li>
	</ul>
</template>

<script setup lang="ts">
	const name = ref("");
	const trimmed = computed(() => name.value.trim());
	const gameOfLifeStore = useGameOfLifeStore();

	function createSnapshot() {
		if (trimmed.value) {
			gameOfLifeStore.createSnapshot(trimmed.value);
		}
	}

	function clearSnapshots() {
		gameOfLifeStore.clearSnapshots();
	}
</script>

<style scoped lang="scss">
	li + li {
		margin-top: 5px;
	}
</style>
