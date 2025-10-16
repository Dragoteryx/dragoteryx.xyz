<template>
	<FormButton v-bind="props" :class="{ highlight: shouldHighlight }" @click="click">
		<slot></slot>
	</FormButton>
</template>

<script setup lang="ts">
	import FormButton, { type Props as BtnProps } from "./form/FormButton.vue";
	import { useRoute, useRouter } from "vue-router";
	import { computed } from "vue";

	export interface Props extends BtnProps {
		highlight?: "exact" | "partial";
		to: string;
	}

	const route = useRoute();
	const router = useRouter();
	const props = defineProps<Props>();
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
