export type WasmModule = typeof import("@/wasm/pkg");

export function useWasmModule<T>(init: (module: WasmModule) => T): Readonly<Ref<T | undefined>> {
	const result = ref<T>();
	onNuxtReady(async () => {
		const module = await import("@/wasm/pkg");
		result.value = init(module);
	});

	return shallowReadonly(result);
}
