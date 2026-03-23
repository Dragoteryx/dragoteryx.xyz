<template>
	<MDC :value="content" class="padded" />
</template>

<script setup lang="ts">
	import content from "@/markdown/home.md?raw";
</script>
