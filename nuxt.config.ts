import wasm from "vite-plugin-wasm";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/color-mode", "@nuxt/icon", "@nuxtjs/tailwindcss"],
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	vite: {
		plugins: [wasm()],
		optimizeDeps: {
			include: ["color-convert"],
		},
	},
});
