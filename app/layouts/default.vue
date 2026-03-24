<template>
	<div class="flex flex-row">
		<AsideMenu />
		<main class="flex flex-col flex-1">
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
