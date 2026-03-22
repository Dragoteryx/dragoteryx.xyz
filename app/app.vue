<template>
	<div class="row">
		<ThemeButton />
		<AsideMenu />
		<main class="large column">
			<NuxtPage />
		</main>
	</div>
</template>

<script setup lang="ts">
	import "@/assets/styles/main.scss";
</script>

<style scoped lang="scss">
	main {
		background: radial-gradient(circle, var(--background-center), var(--background-edges));
		min-height: 100vh;
	}
</style>
