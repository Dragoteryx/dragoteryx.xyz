/// <reference types="vite/client" />

declare module "*.md" {
	import type { DefineComponent } from "vue";
	const Component: DefineComponent;
	export default Component;
}
