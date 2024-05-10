<template>
	<div class="column spaced">
		<FormRange v-model="color.h" :min="0" :max="360">H</FormRange>
		<FormRange v-model="color.s" :min="0" :max="100">S</FormRange>
		<FormRange v-model="color.l" :min="0" :max="100">L</FormRange>
		<div class="row spaced">
			<div ref="preview" class="preview large"></div>
			<ResetButton v-if="reset != undefined" @click="resetColor"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import ResetButton from "./ResetButton.vue";
	import FormRange from "./FormRange.vue";
	import { ref, watchEffect } from "vue";

	export interface Color {
		h: number;
		s: number;
		l: number;
	}

	const preview = ref<HTMLDivElement>();
	const props = defineProps<{
		color: Color;
		reset?: Color;
	}>();

	watchEffect(() => {
		if (preview.value) {
			const h = props.color.h;
			const s = `${props.color.s}%`;
			const l = `${props.color.l}%`;
			preview.value.style.background = `hsl(${h}, ${s}, ${l})`;
		}
	});

	function resetColor() {
		if (props.reset) {
			props.color.h = props.reset.h;
			props.color.s = props.reset.s;
			props.color.l = props.reset.l;
		}
	}
</script>

<style scoped lang="scss">
	.preview {
		border: 1px solid var(--dark);
		height: 24px;
	}
</style>