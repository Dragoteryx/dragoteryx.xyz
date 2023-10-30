<template>
	<aside ref="menu" class="column spaced padded">
		<header class="row spaced">
			<img src="@/assets/tako.png" alt="A Minecraft style Takodachi">
			<div class="column spaced">
				<span><b>Dragoteryx</b></span>
				<hr>
				<span>Developer and Garry's Mod modder.</span>
			</div>
		</header>
		<hr>
		<div class="column spaced">
			<span>Fluent in French and English, currently learning Japanese.</span>
			<div>
				<span>Main programming languages:</span>
				<ul>
					<li>TypeScript</li>
					<li>Rust</li>
					<li>Lua</li>
				</ul>
			</div>
		</div>
		<hr>
		<nav class="column spaced large">
			<NavButton text="Home" icon="pi-home" to="/" highlight="exact"/>
			<NavButton text="2D Sandbox" icon="pi-box" to="/sandbox" highlight="partial"/>
		</nav>
		<hr>
		<footer class="row">
			<a href="https://twitter.com/Dragoteryx" v-hover:pulse>
				<img src="@/assets/twitter_icon.png" alt="Twitter icon">
			</a>
			<a href="https://github.com/Dragoteryx" v-hover:pulse>
				<img src="@/assets/github_icon.png" alt="Github icon">
			</a>
			<a href="https://steamcommunity.com/id/dragoteryx/" v-hover:pulse>
				<img src="@/assets/steam_icon.png" alt="Steam icon">
			</a>
		</footer>
	</aside>
</template>

<script setup lang="ts">
	import NavButton from "@/components/NavButton.vue";
	import { vHover } from "@/directives/animations";
	import { useDimensionsStore } from "@/stores/dimensions";
	import { ref, watchEffect } from "vue";

	const menu = ref<HTMLElement>();
	const dimensionsStore = useDimensionsStore();

	watchEffect(() => {
		dimensionsStore.asideMenuWidth = menu.value?.offsetWidth ?? 0
	});
</script>

<style scoped lang="scss">
	aside {
    width: 290px;
  
    color: var(--white);
    background: var(--light);
		border-left: 1px solid var(--dark);

		display: flex;

    > header > img {
      width: 125px;

      background: radial-gradient(circle, var(--background-center), var(--background-edges));
      border: 1px solid var(--dark);
      border-radius: 50%;
    }

		> footer > a {
			text-align: center;
			max-height: 100px;

			> img {
				width: 60%;
			}
		}
  }
</style>