<template>
	<FormButton icon="lucide:rotate-ccw" label="Reset" icon-size="0.75rem" @click="emit('click')" />
</template>

<script setup lang="ts">
	export interface Emits {
		click: [];
	}

	const emit = defineEmits<Emits>();
</script>
