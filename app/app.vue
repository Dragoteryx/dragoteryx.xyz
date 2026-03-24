<template>
	<ThemeButton />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
	@import "@/assets/styles/main.scss";
</style>

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
