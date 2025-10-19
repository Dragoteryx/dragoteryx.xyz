<template>
	<FormButton class="blue" :icon="ClipboardPlus" @click="gameOfLifeStore.createSnapshot()">Create snapshot</FormButton>
	<FormButton class="orange" :icon="ClipboardX" @click="gameOfLifeStore.clearSnapshots()">Clear snapshots</FormButton>
	<hr />
	<ul>
		<li v-for="(_, index) in gameOfLifeStore.snapshots" :key="index" class="row spaced">
			<span class="large">Snapshot {{ index + 1 }}</span>
			<FormButton class="green" :icon="ClipboardPaste" @click="gameOfLifeStore.loadSnapshot(index)" />
			<FormButton class="red" :icon="ClipboardMinus" @click="gameOfLifeStore.removeSnapshot(index)" />
		</li>
	</ul>
</template>

<script setup lang="ts">
	import { ClipboardPlus, ClipboardX, ClipboardPaste, ClipboardMinus } from "lucide-vue-next";
	import { useGameOfLifeStore } from "@/stores/gameoflife";
	import FormButton from "@/components/form/FormButton.vue";

	const gameOfLifeStore = useGameOfLifeStore();
</script>

<style scoped lang="scss">
	li + li {
		margin-top: 5px;
	}
</style>
