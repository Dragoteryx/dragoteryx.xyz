<template>
	<FormButton :text="text" :icon="icon" :class="{ highlight: shouldHighlight }" @click="click"/>
</template>

<script setup lang="ts">
	import FormButton from "./form/FormButton.vue";
	import { useRoute, useRouter } from "vue-router";
	import { computed } from "vue";

	const props = defineProps<{
		highlight?: "exact" | "partial";
		text?: string;
		icon?: string;
		to: string;
	}>();

	const route = useRoute();
	const router = useRouter();
	const shouldHighlight = computed(() => {
		if (props.highlight == "exact") {
			return route.path == props.to;
		} else if (props.highlight == "partial") {
			return route.path == props.to || route.path.startsWith(props.to + "/");
		} else {
			return false;
		}
	});
	
	function click() {
		router.push(props.to);
	}
</script>

<style scoped lang="scss">
	button {
		width: 100%;
	}

	.highlight {
		font-weight: bold;
	}
</style>