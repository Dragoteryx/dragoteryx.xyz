<template>
	<FormButton
		v-if="!colorMode.unknown"
		aria-label="Toggle dark mode"
		:icon="dark ? 'lucide:moon' : 'lucide:sun'"
		icon-size="1.5rem"
		@click="dark = !dark"
	/>
</template>

<script setup lang="ts">
	const colorMode = useColorMode();
	const dark = computed({
		get: () => colorMode.value == "dark",
		set(value) {
			colorMode.preference = value ? "dark" : "light";
		},
	});
</script>

<style scoped lang="scss">
	button {
		position: fixed;
		border-radius: 100%;
		top: 0.5rem;
		left: 0.5rem;
	}
</style>
