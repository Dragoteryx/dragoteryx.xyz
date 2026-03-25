<template>
	<label class="flex flex-row gap-2">
		<span class="flex-1"><slot></slot></span>
		<input type="checkbox" class="green" v-model="value" />
	</label>
</template>

<script setup lang="ts">
	const value = defineModel<boolean>({ required: true });
</script>

<style scoped lang="scss">
	@use "@/assets/styles/colors.scss";

	input[type="checkbox"] {
		cursor: pointer;
		appearance: none;

		height: 1rem;
		width: 1rem;
		position: relative;
		top: 0.5rem;

		background: var(--medium);
		border: 1px solid var(--dark);

		transition-property: content, background-color;
		transition-duration: 0.2s;

		&:checked {
			@include colors.colored;

			&:after {
				content: "✓";

				color: var(--white);
				position: relative;
				bottom: 0.3rem;
				left: 0.1rem;
			}
		}
	}
</style>
