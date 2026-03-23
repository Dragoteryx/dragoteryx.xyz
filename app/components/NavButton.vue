<template>
	<FormButton v-bind="props" :class="{ highlight }" @click="navigateTo(to)">
		<slot></slot>
	</FormButton>
</template>

<script setup lang="ts">
	import type { Props as BtnProps } from "./form/FormButton.vue";

	export interface Props extends BtnProps {
		highlight?: "exact" | "partial";
		to: string;
	}

	const route = useRoute();
	const props = defineProps<Props>();
	const highlight = computed(() => {
		if (props.highlight == "exact") {
			return route.path == props.to || route.path == props.to + "/";
		} else if (props.highlight == "partial") {
			return route.path == props.to || route.path.startsWith(props.to + "/");
		} else {
			return false;
		}
	});
</script>

<style scoped lang="scss">
	button {
		width: 100%;
	}

	.highlight {
		font-weight: bold;
	}
</style>
