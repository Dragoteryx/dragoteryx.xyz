<template>
	<FormButton icon="lucide:rotate-ccw" :icon-size="12" @click="emit('click')" />
</template>

<script setup lang="ts">
	export interface Emits {
		click: [];
	}

	const emit = defineEmits<Emits>();
</script>
