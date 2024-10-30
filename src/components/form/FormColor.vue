<template>
	<div class="column spaced">
		<FormColorRgb v-if="mode == 'rgb'" v-model="color"/>
		<FormColorHsl v-if="mode == 'hsl'" v-model="color"/>
		<FormColorHsv v-if="mode == 'hsv'" v-model="color"/>
		<div class="row spaced">
			<div ref="preview" :class="previewClasses">{{ hex.substring(1) }}</div>
			<ResetButton v-if="reset != undefined" @click="resetColor"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import FormColorRgb from "./color/FormColorRgb.vue";
	import FormColorHsl from "./color/FormColorHsl.vue";
	import FormColorHsv from "./color/FormColorHsv.vue";
	import ResetButton from "./ResetButton.vue";
	import { computed, useTemplateRef, watchEffect } from "vue";
	import { useHex, useHsl } from "@/composables/color";
	import { Color } from "@/types/color";

	const preview = useTemplateRef("preview");
	const color = defineModel<Color>({required: true});
	const hex = useHex(color);
	const hsl = useHsl(color);
	const props = defineProps<{
		mode: "rgb" | "hsl" | "hsv",
		reset?: Color
	}>();

	const previewClasses = computed(() => {
		const classes = ["preview", "large"];
		if (hsl.value.l < 50) classes.push("light");
		return classes;
	});

	watchEffect(() => {
		if (preview.value) {
			preview.value.style.backgroundColor = hex.value;
		}
	});

	function resetColor() {
		if (props.reset) {
			color.value = Color.parse(props.reset);
		}
	}
</script>

<style scoped lang="scss">
	.preview {
		border: 1px solid var(--dark);
		color: var(--dark);
		height: 24px;
		padding-left: 4px;
		font-size: 16px;
		font-weight: 550;

		&.light {
			color: var(--white);
		}
	}
</style>