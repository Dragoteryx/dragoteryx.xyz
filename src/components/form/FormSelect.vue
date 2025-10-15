<template>
	<select v-model="value">
		<option v-for="option in options" :value="option.value">
			{{ option.description }}
		</option>
	</select>
</template>

<script setup lang="ts" generic="T extends string">
	export interface Props<T> {
		options: Option<T>[];
	}

	export interface Option<T> {
		value: T;
		description: string;
	}

	const value = defineModel<T>({ required: true });
	const props = defineProps<Props<T>>();
</script>

<style scoped lang="scss">
	select {
		border: 1px solid var(--dark);
		background: var(--medium);
		color: var(--white);
		padding: 5px;
		outline: none;
	}
</style>
