<template>
	<label class="row spaced">
		<span class="large"><slot></slot></span>
		<input type="checkbox" class="green" v-model="value"/>
	</label>
</template>

<script setup lang="ts">
  const value = defineModel<boolean>({required: true});
</script>

<style scoped lang="scss">
	@use "@/styles/mixins.scss";

	input[type=checkbox] {
		cursor: pointer;
		appearance: none;

		height: 15px;
		width: 15px;
		position: relative;
		top: 5px;

		background: var(--medium);
		border: 1px solid var(--dark);

		transition-property: content, background-color;
		transition-duration: 0.2s;

		&:checked {
			@include mixins.colored;

			&:after {
				content: "✓";

				color: var(--white);
				position: relative;
				bottom: 2.5px;
				left: 2px;
			}
		}
	}
</style>