<template>
	<div class="column spaced">
		<FormColorRgb v-if="mode == 'rgb'" v-model="color"/>
		<FormColorHsl v-if="mode == 'hsl'" v-model="color"/>
		<FormColorHsv v-if="mode == 'hsv'" v-model="color"/>
		<FormColorHex v-model="color"/>
		<div class="row spaced">
			<div ref="preview" class="preview large"></div>
			<ResetButton v-if="reset != undefined" @click="resetColor"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import FormColorHex from "./color/FormColorHex.vue";
	import FormColorRgb from "./color/FormColorRgb.vue";
	import FormColorHsl from "./color/FormColorHsl.vue";
	import FormColorHsv from "./color/FormColorHsv.vue";
	import ResetButton from "./ResetButton.vue";
	import { useTemplateRef, watchEffect } from "vue";
	import { Color, toHex } from "@/types/color";

	const preview = useTemplateRef("preview");
	const color = defineModel<Color>({required: true});
	const props = defineProps<{
		mode: "rgb" | "hsl" | "hsv",
		reset?: Color
	}>();

	watchEffect(() => {
		if (preview.value) {
			preview.value.style.backgroundColor = toHex(color.value);
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
		height: 24px;
	}
</style>