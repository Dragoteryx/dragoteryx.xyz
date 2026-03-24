<template>
	<div class="flex flex-col gap-2">
		<FormColorRgb v-if="mode == 'rgb'" v-model="color" />
		<FormColorHsl v-if="mode == 'hsl'" v-model="color" />
		<FormColorHsv v-if="mode == 'hsv'" v-model="color" />
		<FormColorHwb v-if="mode == 'hwb'" v-model="color" />
		<FormColorCmyk v-if="mode == 'cmyk'" v-model="color" />
		<div class="flex flex-row gap-2">
			<div :style="{ backgroundColor: color.hex }" :class="previewClasses">{{ color.hex }}</div>
			<ResetButton v-if="reset != undefined" @click="resetColor" />
		</div>
	</div>
</template>

<script setup lang="ts">
	export interface Props {
		reset?: Color;
		mode: string;
	}

	const color = defineModel<Color>({ required: true });
	const props = defineProps<Props>();

	const previewClasses = computed(() => {
		const classes = ["preview", "flex-1", "pl-1"];
		if (color.value.hsl.l < 50) classes.push("dark");
		return classes;
	});

	function resetColor() {
		if (props.reset) {
			color.value = props.reset;
		}
	}
</script>

<style scoped lang="scss">
	.preview {
		border: 1px solid var(--dark);
		color: var(--dark);
		height: 1.5rem;
		font-weight: 550;

		&.dark {
			color: var(--white);
		}
	}
</style>
