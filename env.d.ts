/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const Component: DefineComponent;
	export default Component;
}

declare module "*.md" {
	import type { DefineComponent } from "vue";
	const Component: DefineComponent;
	export default Component;
}
