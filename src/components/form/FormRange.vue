<template>
	<label class="row spaced">
		<span><slot></slot></span>
		<input class="large" type="range" v-model="value" :min="min" :max="max">
		<ResetButton v-if="reset != undefined" @click="value = reset"/>
	</label>
</template>

<script setup lang="ts">
	import ResetButton from "./ResetButton.vue";

	const value = defineModel<number>({ default: 0 });
	defineProps<{
		reset?: number,
		min: number,
		max: number,
	}>();
</script>