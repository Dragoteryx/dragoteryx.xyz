import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import markdown from "unplugin-vue-markdown/vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue({include: [/\.vue$/, /\.md$/]}),
		vueDevTools(),
		markdown({}),
		// @ts-expect-error
		topLevelAwait(),
		// @ts-expect-error
		wasm(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
