import wasm from "vite-plugin-wasm";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/color-mode", "@nuxtjs/mdc"],
	vite: {
		plugins: [wasm()],
		optimizeDeps: {
			include: ["color-convert", "lucide-vue-next"],
		},
	},
});
