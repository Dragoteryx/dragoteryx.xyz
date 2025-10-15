<template>
	<select v-model="value">
		<option v-for="option in options" :value="option.value">
			{{ option.description }}
		</option>
	</select>
</template>

<script setup lang="ts" generic="T extends string">
	const value = defineModel<T>({ required: true });
	defineProps<{
		options: readonly { value: NoInfer<T>; description: string }[];
	}>();
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
