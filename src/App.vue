<template>
  <ThemeButton />
  <AsideMenu />
  <main class="large column">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
  import AsideMenu from "./components/AsideMenu.vue";
  import ThemeButton from "./components/ThemeButton.vue";
  import { RouterView } from "vue-router";
</script>

<style scoped lang="scss">
  main {
    background: radial-gradient(circle, var(--background-center), var(--background-edges));
    min-height: 100vh;
  }
</style>