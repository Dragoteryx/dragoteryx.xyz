<template>
	<FormText v-model="hex"/>
</template>

<script setup lang="ts">
	import { useHex } from "@/composables/color";
	import type { Color } from "@/types/color";
	import FormText from "../FormText.vue";
	
	const color = defineModel<Color>({required: true});
	const hex = useHex(color);
</script>