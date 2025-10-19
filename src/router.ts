import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: () => import("@/views/markdown/Home.md"),
		},
		{
			path: "/sandbox",
			name: "sandbox",
			component: () => import("@/views/Sandbox.vue"),
			children: [
				{
					path: "",
					name: "sandbox-spawn",
					component: () => import("@/views/sandbox/SandboxSpawn.vue"),
				},
				{
					path: "settings",
					name: "sandbox-settings",
					component: () => import("@/views/sandbox/SandboxSettings.vue"),
				},
			],
		},
		{
			path: "/game-of-life",
			name: "game-of-life",
			component: () => import("@/views/GameOfLife.vue"),
			children: [
				{
					path: "",
					name: "game-of-life-snapshots",
					component: () => import("@/views/gameoflife/GameOfLifeSnapshots.vue"),
				},
				{
					path: "settings",
					name: "game-of-life-settings",
					component: () => import("@/views/gameoflife/GameOfLifeSettings.vue"),
				},
			],
		},
		{
			path: "/boids",
			name: "boids",
			component: () => import("@/views/Boids.vue"),
		},
		{
			path: "/:path(.*)*",
			component: () => import("@/views/markdown/NotFound.md"),
		},
	],
});
