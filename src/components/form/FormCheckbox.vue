<template>
	<label class="row spaced">
		<span class="large"><slot></slot></span>
		<input type="checkbox" class="green" v-model="value"/>
	</label>
</template>

<script setup lang="ts">
  const value = defineModel<boolean>({ default: false });
</script>