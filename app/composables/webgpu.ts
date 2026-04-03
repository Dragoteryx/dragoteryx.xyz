export function useGPUDevice(): ComputedRef<GPUDevice | undefined> {
	const webGpu = useWebGPU();
	return computed(() => webGpu.value?.device);
}

export function usePreferredTextureFormat(): ComputedRef<GPUTextureFormat | undefined> {
	return computed(() => {
		if (import.meta.client && "gpu" in navigator) {
			return navigator.gpu.getPreferredCanvasFormat();
		}
	});
}

export function useShaderModule(code: MaybeRefOrGetter<string>) {
	const device = useGPUDevice();
	return computed(() => {
		return device.value?.createShaderModule({ code: toValue(code) });
	});
}

export function useGPUBuffer(descriptor: MaybeRefOrGetter<GPUBufferDescriptor | undefined>) {
	const device = useGPUDevice();
	return computed(() => {
		const descriptorValue = toValue(descriptor);
		if (descriptorValue) {
			return device.value?.createBuffer(descriptorValue);
		}
	});
}

export function useComputePipeline(descriptor: MaybeRefOrGetter<GPUComputePipelineDescriptor | undefined>) {
	const device = useGPUDevice();
	return computed(() => {
		const descriptorValue = toValue(descriptor);
		if (descriptorValue) {
			return device.value?.createComputePipeline(descriptorValue);
		}
	});
}

export function useRenderPipeline(descriptor: MaybeRefOrGetter<GPURenderPipelineDescriptor | undefined>) {
	const device = useGPUDevice();
	return computed(() => {
		const descriptorValue = toValue(descriptor);
		if (descriptorValue) {
			return device.value?.createRenderPipeline(descriptorValue);
		}
	});
}

export function useBindGroupLayout(descriptor: MaybeRefOrGetter<GPUBindGroupLayoutDescriptor | undefined>) {
	const device = useGPUDevice();
	return computed(() => {
		const descriptorValue = toValue(descriptor);
		if (descriptorValue) {
			return device.value?.createBindGroupLayout(descriptorValue);
		}
	});
}

export function useBindGroup(descriptor: MaybeRefOrGetter<GPUBindGroupDescriptor | undefined>) {
	const device = useGPUDevice();
	return computed(() => {
		const descriptorValue = toValue(descriptor);
		if (descriptorValue) {
			return device.value?.createBindGroup(descriptorValue);
		}
	});
}

export function usePipelineLayout(descriptor: MaybeRefOrGetter<GPUPipelineLayoutDescriptor | undefined>) {
	const device = useGPUDevice();
	return computed(() => {
		const descriptorValue = toValue(descriptor);
		if (descriptorValue) {
			return device.value?.createPipelineLayout(descriptorValue);
		}
	});
}
