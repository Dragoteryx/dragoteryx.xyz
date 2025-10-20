<template>
	<FormButton class="orange" :icon="ClipboardX" @click="clearSnapshots()">Clear snapshots</FormButton>
	<FormButton class="blue" :icon="ClipboardPlus" @click="createSnapshot()" :disabled="!trimmed">
		Create snapshot
	</FormButton>
	<FormText v-model="name" placeholder="Snapshot name" @submit="createSnapshot()" />
	<hr />
	<ul>
		<li v-for="[name, _] in gameOfLifeStore.snapshots" class="row spaced">
			<span class="large">{{ name }}</span>
			<FormButton class="green" :icon="ClipboardPaste" @click="gameOfLifeStore.loadSnapshot(name)" />
			<FormButton class="red" :icon="ClipboardMinus" @click="gameOfLifeStore.removeSnapshot(name)" />
		</li>
	</ul>
</template>

<script setup lang="ts">
	import { ClipboardPlus, ClipboardX, ClipboardPaste, ClipboardMinus } from "lucide-vue-next";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import FormButton from "@/components/form/FormButton.vue";
	import FormText from "@/components/form/FormText.vue";
	import { computed, ref } from "vue";

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
