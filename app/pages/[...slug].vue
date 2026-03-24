<template>
	<MDC :value="content" class="flex flex-col px-4 py-2" />
</template>

<script setup lang="ts">
	import content from "@/markdown/unknown.md?raw";
</script>
