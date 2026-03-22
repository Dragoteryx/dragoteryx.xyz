<template>
	<FormButton :icon="RotateCcw" :icon-size="12" @click="emit('click')" />
</template>

<script setup lang="ts">
	import { RotateCcw } from "lucide-vue-next";

	export interface Emits {
		click: [];
	}

	const emit = defineEmits<Emits>();
</script>
