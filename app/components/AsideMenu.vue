<template>
	<aside class="flex flex-col gap-2 px-4 py-2">
		<header class="flex flex-row gap-4">
			<img src="@/assets/images/tako.png" alt="A Minecraft style Takodachi" />
			<div class="flex flex-col gap-2">
				<span><b>Dragoteryx</b></span>
				<hr />
				<span>Developer and Garry's Mod modder.</span>
			</div>
		</header>
		<hr />
		<div class="flex flex-col gap-2">
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
		<hr />
		<nav class="flex flex-col flex-1 gap-2">
			<NavButton icon="lucide:house" to="/" highlight="exact">Home</NavButton>
			<NavButton icon="lucide:shapes" to="/sandbox" highlight="partial">2D Sandbox</NavButton>
			<NavButton icon="lucide:dna" to="/game-of-life" highlight="partial">Game of Life</NavButton>
			<NavButton v-if="dev" icon="lucide:fish" to="/boids" highlight="partial">Boids</NavButton>
		</nav>
		<hr />
		<footer class="flex flex-row">
			<a href="https://twitter.com/Dragoteryx">
				<img src="@/assets/images/twitter_icon.png" alt="Twitter icon" class="mx-auto" />
			</a>
			<a href="https://github.com/Dragoteryx">
				<img src="@/assets/images/github_icon.png" alt="Github icon" class="mx-auto" />
			</a>
			<a href="https://steamcommunity.com/id/dragoteryx/">
				<img src="@/assets/images/steam_icon.png" alt="Steam icon" class="mx-auto" />
			</a>
		</footer>
	</aside>
</template>

<script setup lang="ts">
	const dev = import.meta.dev;
</script>

<style scoped lang="scss">
	aside {
		width: 18rem;

		color: var(--white);
		background: var(--light);
		border-right: 1px solid var(--dark);

		display: flex;

		> header > img {
			width: 8rem;

			background: radial-gradient(circle, var(--background-center), var(--background-edges));
			border: 1px solid var(--dark);
			border-radius: 50%;
		}

		> footer > a {
			text-align: center;

			> img {
				width: 60%;
			}
		}
	}
</style>
