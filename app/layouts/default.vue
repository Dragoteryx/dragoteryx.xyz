<template>
	<div class="row">
		<ThemeButton />
		<AsideMenu />
		<main class="large column">
			<slot></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
	main {
		background: radial-gradient(circle, var(--background-center), var(--background-edges));
		min-height: 100vh;
	}
</style>
