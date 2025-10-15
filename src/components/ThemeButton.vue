<template>
	<FormButton aria-label="Toggle dark mode" :icon="dark ? 'pi-moon' : 'pi-sun'" @click="dark = !dark" />
</template>

<script setup lang="ts">
	import FormButton from "./form/FormButton.vue";
	import { useDark } from "@vueuse/core";

	const dark = useDark();
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
