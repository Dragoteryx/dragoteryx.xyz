<template>
	<input type="text" v-model="text" :disabled="disabled"/>
</template>

<script setup lang="ts">
	const text = defineModel<string>({required: true});
	defineProps<{disabled?: boolean}>();
</script>

<style scoped lang="scss" >
	input[type=text] {
		border: 1px solid var(--dark);
		background: var(--background-center);
		color: var(--text);
		padding: 5px;
	}
</style>