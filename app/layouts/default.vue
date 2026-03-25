<template>
	<div class="flex flex-row">
		<AsideMenu />
		<main class="flex flex-col flex-1">
			<slot></slot>
		</main>
	</div>
</template>

<script setup lang="ts">
	useHead({
		titleTemplate: "%s | dragoteryx.xyz",
		htmlAttrs: { lang: "en" },
		meta: [
			{ name: "author", content: "Dragoteryx" },
			{ name: "description", content: "A personal website for Dragoteryx, a software developer and content creator." },
			{ name: "keywords", content: "dragoteryx, software developer, content creator, personal website" },
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
		],
	});
</script>

<style scoped lang="scss">
	main {
		background: radial-gradient(circle, var(--background-center), var(--background-edges));
		min-height: 100vh;
	}
</style>
