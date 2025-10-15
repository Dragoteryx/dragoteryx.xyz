<template>
	<ThemeButton />
	<AsideMenu />
	<main class="large column">
		<RouterView />
	</main>
</template>

<script setup lang="ts">
	import AsideMenu from "./components/AsideMenu.vue";
	import ThemeButton from "./components/ThemeButton.vue";
	import { RouterView } from "vue-router";
</script>

<style scoped lang="scss">
	main {
		background: radial-gradient(circle, var(--background-center), var(--background-edges));
		min-height: 100vh;
		/*background: linear-gradient(to top, black, #0000 50%),
      linear-gradient(to bottom, white, #0000 50%),
      linear-gradient(to right, hsl(90, 0%, 50%), hsl(0, 100%, 50%));*/
		/*background: linear-gradient(to top, black, #0000),
      linear-gradient(to right, white, red);*/
	}
</style>
