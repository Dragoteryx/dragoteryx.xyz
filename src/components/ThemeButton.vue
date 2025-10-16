<template>
	<FormButton aria-label="Toggle dark mode" :icon="icon" :icon-size="25" @click="dark = !dark" />
</template>

<script setup lang="ts">
	import FormButton from "./form/FormButton.vue";
	import { Sun, Moon } from "lucide-vue-next";
	import { useDark } from "@vueuse/core";
	import { computed } from "vue";

	const dark = useDark();
	const icon = computed(() => (dark.value ? Moon : Sun));
</script>

<style scoped lang="scss">
	button {
		position: fixed;
		border-radius: 100%;
		font-size: 25px;
		top: 10px;
		left: 10px;
	}
</style>
