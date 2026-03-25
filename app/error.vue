<template>
	<ThemeButton />
	<NuxtLayout>
		<div class="flex flex-col px-4 py-2">
			<h1>Error {{ error.status }}</h1>
			<p>{{ error.message }}</p>
		</div>
	</NuxtLayout>
</template>

<style>
	@import "@/assets/styles/main.scss";
</style>

<script setup lang="ts">
	import type { NuxtError } from "#app";

	export interface Props {
		error: NuxtError;
	}

	const props = defineProps<Props>();
	useHead({ title: `Error ${props.error.status}` });
</script>
