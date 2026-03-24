<template>
	<div class="flex flex-col gap-2">
		<FormButton class="orange" icon="lucide:clipboard-x" @click="clearSnapshots()">Clear snapshots</FormButton>
		<FormButton class="blue" icon="lucide:clipboard-plus" @click="createSnapshot()" :disabled="!trimmed">
			Create snapshot
		</FormButton>
		<FormText v-model="name" placeholder="Snapshot name" @submit="createSnapshot()" />
		<hr />
		<ul class="flex flex-col gap-1">
			<li v-for="[name, _] in gameOfLifeStore.snapshots" class="flex flex-row gap-2">
				<span class="flex-1">{{ name }}</span>
				<FormButton class="green" icon="lucide:clipboard-paste" @click="gameOfLifeStore.loadSnapshot(name)" />
				<FormButton class="red" icon="lucide:clipboard-minus" @click="gameOfLifeStore.removeSnapshot(name)" />
			</li>
		</ul>
	</div>
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
