/// <reference types="@webgpu/types" />

export type WasmModule = typeof import("@/wasm/pkg");

export interface WebGPU {
	adapter: GPUAdapter;
	device: GPUDevice;
}

export function useWasmModule(): ComputedRef<WasmModule | undefined> {
	const ffiStore = useFfiStore();
	return computed(() => ffiStore.wasm);
}

export function useWebGPU(): ComputedRef<WebGPU | undefined> {
	const ffiStore = useFfiStore();
	return computed(() => ffiStore.webGpu);
}

export const useFfiStore = defineStore("ffi", () => {
	const wasm = asyncComputed(() => {
		if (import.meta.client) {
			return import("@/wasm/pkg");
		}
	});

	const webGpu = ref<WebGPU | undefined>();
	async function initWebGPU(attempt = 0) {
		if (import.meta.client && "gpu" in navigator) {
			const adapter = await navigator.gpu.requestAdapter();
			const device = await adapter?.requestDevice();
			if (adapter && device) {
				webGpu.value = { adapter, device };
				const info = await device.lost;
				webGpu.value = undefined;
				if (info.reason != "destroyed" && attempt < 3) {
					const delay = Math.min(1000 * 2 ** attempt, 10_000);
					setTimeout(() => initWebGPU(attempt + 1), delay);
				}
			}
		}
	}

	initWebGPU();

	return {
		wasm,
		webGpu,
	};
});
