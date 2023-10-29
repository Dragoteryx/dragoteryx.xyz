<template>
	<aside ref="aside" class="column spaced padded">
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
			<NavButton to="/" highlight="exact">Home</NavButton>
			<NavButton to="/sandbox" highlight="partial">2D Sandbox</NavButton>
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
	import { useMiscStore } from "@/stores/misc";
	import { vHover } from "@/directives/animations";
	import { ref, watchEffect } from "vue";
	
	const aside = ref<HTMLDivElement>();
	const miscStore = useMiscStore();

	watchEffect(() => {
		miscStore.asideWidth = aside.value?.offsetWidth ?? Infinity;
	});
</script>

<style scoped lang="scss">
	aside {
    width: 290px;
  
    color: var(--white);
    background: var(--light);

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