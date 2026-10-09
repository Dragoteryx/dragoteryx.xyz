import computeCode from "@/assets/shaders/particles/compute.wgsl?raw";
import renderCode from "@/assets/shaders/particles/render.wgsl?raw";
import bvhCode from "@/assets/shaders/particles/bvh.wgsl?raw";
import { skipHydrate } from "pinia";

export const DEFAULT_COLOR = new Hsl(90, 50, 50);
export const MAX_PARTICLES = 25_000;
export const PARTICLE_STRIDE = 32;
export const NODE_STRIDE = 32;
export const SORT_KEY_STRIDE = 8;
export const SORT_PARAMS_STRIDE = 256;
export const MAX_SORT_SIZE = 2 ** Math.ceil(Math.log2(MAX_PARTICLES));
export const MAX_SORT_STEPS = Math.log2(MAX_SORT_SIZE) * (Math.log2(MAX_SORT_SIZE) + 1) / 2;

export interface Bounds {
	width: number;
	height: number;
}

export interface Gravity {
	strength: number;
	angle: number;
}

export interface Options {
	colorPicker: Color.Type;
}

export const useParticlesStore = defineStore("particles", () => {
	const ctx = ref<GPUCanvasContext>();
	const device = useGPUDevice();
	const radius = ref(6);
	const particleCount = ref(0);
	const color = skipHydrate(ref(DEFAULT_COLOR));
	const controls = useControls(60, paused => {
		if (!paused) update();
		render();
	});

	const bounds: Bounds = reactive({
		width: ref(0),
		height: ref(0),
	});

	const gravity: Gravity = reactive({
		strength: ref(981),
		angle: ref(0),
	});

	const options: Options = reactive({
		colorPicker: ref("hsl"),
	});

	const particles = computed(() => {
		if (device.value) {
			const computeModule = device.value.createShaderModule({ code: computeCode });
			const bvhModule = device.value.createShaderModule({ code: bvhCode });
			const renderModule = device.value.createShaderModule({ code: renderCode });
			const format = navigator.gpu.getPreferredCanvasFormat();
			const reverseParticleBuffers = ref(false);

			const particleBuffer1 = device.value.createBuffer({
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
				size: MAX_PARTICLES * PARTICLE_STRIDE,
			});

			const particleBuffer2 = device.value.createBuffer({
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
				size: MAX_PARTICLES * PARTICLE_STRIDE,
			});

			const particleInBuffer = computed(() => {
				return reverseParticleBuffers.value ? particleBuffer2 : particleBuffer1;
			});

			const particleCountBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				size: 4,
			});

			const gravityBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				size: 8,
			});

			const boundsBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				size: 8,
			});

			const sortKeysBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.STORAGE,
				size: MAX_SORT_SIZE * SORT_KEY_STRIDE,
			});

			const sortParamsBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
				size: MAX_SORT_STEPS * SORT_PARAMS_STRIDE,
			});

			const nodesBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.STORAGE,
				size: (MAX_PARTICLES * 2 - 1) * NODE_STRIDE,
			});

			const refitFlagsBuffer = device.value.createBuffer({
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
				size: MAX_PARTICLES * 4,
			});

			const sortParams = new Uint32Array(MAX_SORT_STEPS * SORT_PARAMS_STRIDE / 4);
			for (let k = 2, step = 0; k <= MAX_SORT_SIZE; k *= 2) {
				for (let j = k / 2; j >= 1; j /= 2, step++) {
					sortParams[step * SORT_PARAMS_STRIDE / 4 + 0] = k;
					sortParams[step * SORT_PARAMS_STRIDE / 4 + 1] = j;
				}
			}

			device.value.queue.writeBuffer(sortParamsBuffer, 0, sortParams);

			const computeBindGroupLayout = device.value.createBindGroupLayout({
				entries: [
					{ binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
					{ binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
					{ binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
					{ binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
					{ binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
					{ binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
				],
			});

			const computeBindGroup1 = device.value.createBindGroup({
				layout: computeBindGroupLayout,
				entries: [
					{ binding: 0, resource: { buffer: particleBuffer1 } },
					{ binding: 1, resource: { buffer: particleBuffer2 } },
					{ binding: 2, resource: { buffer: particleCountBuffer } },
					{ binding: 3, resource: { buffer: gravityBuffer } },
					{ binding: 4, resource: { buffer: boundsBuffer } },
					{ binding: 5, resource: { buffer: nodesBuffer } },
				],
			});

			const computeBindGroup2 = device.value.createBindGroup({
				layout: computeBindGroupLayout,
				entries: [
					{ binding: 0, resource: { buffer: particleBuffer2 } },
					{ binding: 1, resource: { buffer: particleBuffer1 } },
					{ binding: 2, resource: { buffer: particleCountBuffer } },
					{ binding: 3, resource: { buffer: gravityBuffer } },
					{ binding: 4, resource: { buffer: boundsBuffer } },
					{ binding: 5, resource: { buffer: nodesBuffer } },
				],
			});

			const computePipelineLayout = device.value.createPipelineLayout({
				bindGroupLayouts: [computeBindGroupLayout]
			});

			const updatePositionsPipeline = device.value.createComputePipeline({
				layout: computePipelineLayout,
				compute: {
					module: computeModule,
					entryPoint: "update_positions",
				},
			});

			const resolveCollisionsPipeline = device.value.createComputePipeline({
				layout: computePipelineLayout,
				compute: {
					module: computeModule,
					entryPoint: "resolve_collisions",
				},
			});

			const applyWorldBoundsPipeline = device.value.createComputePipeline({
				layout: computePipelineLayout,
				compute: {
					module: computeModule,
					entryPoint: "apply_world_bounds",
				},
			});

			const bvhBindGroupLayout = device.value.createBindGroupLayout({
				entries: [
					{ binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
					{ binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
					{ binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
					{ binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } },
					{ binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
					{ binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform" } },
					{ binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: "uniform", hasDynamicOffset: true } },
				],
			});

			const bvhBindGroup1 = device.value.createBindGroup({
				layout: bvhBindGroupLayout,
				entries: [
					{ binding: 0, resource: { buffer: particleBuffer1 } },
					{ binding: 1, resource: { buffer: sortKeysBuffer } },
					{ binding: 2, resource: { buffer: nodesBuffer } },
					{ binding: 3, resource: { buffer: refitFlagsBuffer } },
					{ binding: 4, resource: { buffer: particleCountBuffer } },
					{ binding: 5, resource: { buffer: boundsBuffer } },
					{ binding: 6, resource: { buffer: sortParamsBuffer, size: 8 } },
				],
			});

			const bvhBindGroup2 = device.value.createBindGroup({
				layout: bvhBindGroupLayout,
				entries: [
					{ binding: 0, resource: { buffer: particleBuffer2 } },
					{ binding: 1, resource: { buffer: sortKeysBuffer } },
					{ binding: 2, resource: { buffer: nodesBuffer } },
					{ binding: 3, resource: { buffer: refitFlagsBuffer } },
					{ binding: 4, resource: { buffer: particleCountBuffer } },
					{ binding: 5, resource: { buffer: boundsBuffer } },
					{ binding: 6, resource: { buffer: sortParamsBuffer, size: 8 } },
				],
			});

			const bvhPipelineLayout = device.value.createPipelineLayout({
				bindGroupLayouts: [bvhBindGroupLayout]
			});

			const computeMortonCodesPipeline = device.value.createComputePipeline({
				layout: bvhPipelineLayout,
				compute: {
					module: bvhModule,
					entryPoint: "compute_morton_codes",
				},
			});

			const bitonicSortStepPipeline = device.value.createComputePipeline({
				layout: bvhPipelineLayout,
				compute: {
					module: bvhModule,
					entryPoint: "bitonic_sort_step",
				},
			});

			const buildHierarchyPipeline = device.value.createComputePipeline({
				layout: bvhPipelineLayout,
				compute: {
					module: bvhModule,
					entryPoint: "build_hierarchy",
				},
			});

			const refitBoundsPipeline = device.value.createComputePipeline({
				layout: bvhPipelineLayout,
				compute: {
					module: bvhModule,
					entryPoint: "refit_bounds",
				},
			});

			async function update() {
				if (!device.value) return;
				if (particleCount.value == 0) return;
				const commandEncoder = device.value.createCommandEncoder();
				const workgroups = Math.ceil(particleCount.value / 64);
				const sortSize = 2 ** Math.ceil(Math.log2(particleCount.value));
				const bvhBindGroup = reverseParticleBuffers.value ? bvhBindGroup2 : bvhBindGroup1;

				const bvhPassEncoder = commandEncoder.beginComputePass();
				bvhPassEncoder.setPipeline(computeMortonCodesPipeline);
				bvhPassEncoder.setBindGroup(0, bvhBindGroup, [0]);
				bvhPassEncoder.dispatchWorkgroups(Math.ceil(sortSize / 64));
				bvhPassEncoder.setPipeline(bitonicSortStepPipeline);
				for (let k = 2, step = 0; k <= sortSize; k *= 2) {
					for (let j = k / 2; j >= 1; j /= 2, step++) {
						bvhPassEncoder.setBindGroup(0, bvhBindGroup, [step * SORT_PARAMS_STRIDE]);
						bvhPassEncoder.dispatchWorkgroups(Math.ceil(sortSize / 128));
					}
				}

				bvhPassEncoder.setPipeline(buildHierarchyPipeline);
				bvhPassEncoder.setBindGroup(0, bvhBindGroup, [0]);
				bvhPassEncoder.dispatchWorkgroups(workgroups);
				bvhPassEncoder.end();

				for (let i = 0; i < 16; i++) {
					const bindGroup1 = reverseParticleBuffers.value ? computeBindGroup2 : computeBindGroup1;
					const bindGroup2 = reverseParticleBuffers.value ? computeBindGroup1 : computeBindGroup2;
					const bindGroup3 = reverseParticleBuffers.value ? bvhBindGroup1 : bvhBindGroup2;
					reverseParticleBuffers.value = !reverseParticleBuffers.value;

					const passEncoder = commandEncoder.beginComputePass();
					passEncoder.setPipeline(updatePositionsPipeline);
					passEncoder.setBindGroup(0, bindGroup1);
					passEncoder.dispatchWorkgroups(workgroups);
					passEncoder.end();

					commandEncoder.clearBuffer(refitFlagsBuffer);

					const passEncoder2 = commandEncoder.beginComputePass();
					passEncoder2.setPipeline(refitBoundsPipeline);
					passEncoder2.setBindGroup(0, bindGroup3, [0]);
					passEncoder2.dispatchWorkgroups(workgroups);
					passEncoder2.end();

					const passEncoder3 = commandEncoder.beginComputePass();
					passEncoder3.setPipeline(resolveCollisionsPipeline);
					passEncoder3.setBindGroup(0, bindGroup2);
					passEncoder3.dispatchWorkgroups(workgroups);
					passEncoder3.end();

					const passEncoder4 = commandEncoder.beginComputePass();
					passEncoder4.setPipeline(applyWorldBoundsPipeline);
					passEncoder4.setBindGroup(0, bindGroup1);
					passEncoder4.dispatchWorkgroups(workgroups);
					passEncoder4.end();
				}

				device.value.queue.submit([commandEncoder.finish()]);
			}

			const renderBindGroupLayout = device.value.createBindGroupLayout({
				entries: [
					{ binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
				],
			});

			const renderBindGroup = device.value.createBindGroup({
				layout: renderBindGroupLayout,
				entries: [
					{ binding: 0, resource: { buffer: boundsBuffer } },
				],
			});

			const renderPipelineLayout = device.value.createPipelineLayout({
				bindGroupLayouts: [renderBindGroupLayout]
			});

			const renderPipeline = device.value.createRenderPipeline({
				layout: renderPipelineLayout,
				fragment: {
					module: renderModule,
					entryPoint: "fs_main",
					targets: [{ format }],
				},
				vertex: {
					module: renderModule,
					entryPoint: "vs_main",
					buffers: [
						{
							arrayStride: PARTICLE_STRIDE,
							stepMode: "instance",
							attributes: [
								{ shaderLocation: 0	, offset: 0, format: "float32x2" },
								{ shaderLocation: 1, offset: 16, format: "float32x3" },
								{ shaderLocation: 2, offset: 28, format: "float32" },
							],
						},
					],
				},
			});

			function render() {
				if (device.value && ctx.value) {
					if (!ctx.value.getConfiguration()) {
						ctx.value.configure({
							alphaMode: "premultiplied",
							device: device.value,
							format,
						});
					}

					if (particleCount.value == 0) {
						ctx.value.getCurrentTexture().destroy();
						return;
					}

					const commandEncoder = device.value.createCommandEncoder();
					const textureView = ctx.value.getCurrentTexture().createView();
					const passEncoder = commandEncoder.beginRenderPass({
						colorAttachments: [
							{
								view: textureView,
								loadOp: "clear",
								storeOp: "store",
							},
						],
					});

					passEncoder.setPipeline(renderPipeline);
					passEncoder.setBindGroup(0, renderBindGroup);
					passEncoder.setVertexBuffer(0, particleInBuffer.value);
					passEncoder.draw(6, particleCount.value);
					passEncoder.end();

					device.value.queue.submit([commandEncoder.finish()]);
				}
			}

			async function spawnParticle(x?: number, y?: number) {
				await spawnParticles(1, x, y);
			}

			async function spawnParticles(count: number, x?: number, y?: number) {
				const newCount = Math.min(particleCount.value + count, MAX_PARTICLES);
				const particles = await fetchParticleBuffer();
				if (particles) {
					for (let i = particleCount.value; i < newCount; i++) {
						const entColor = addLightness(color.value, Math.random() * 10 - 5);
						const posX = x ?? (Math.random() * bounds.width);
						const posY = y ?? (Math.random() * bounds.height);
						const { r, g, b } = entColor.rgb;
						particles[i * 8 + 0] = posX;
						particles[i * 8 + 1] = posY;
						particles[i * 8 + 2] = posX;
						particles[i * 8 +	3] = posY;
						particles[i * 8 + 4] = r / 255;
						particles[i * 8 + 5] = g / 255;
						particles[i * 8 + 6] = b / 255;
						particles[i * 8 + 7] = radius.value;
					}

					saveParticleBuffer(particles);
					particleCount.value = newCount;
				}
			}

			function clearParticles() {
				if (device.value) {
					const emptyData = new Float32Array(MAX_PARTICLES * PARTICLE_STRIDE / 4);
					device.value.queue.writeBuffer(particleInBuffer.value, 0, emptyData);
					particleCount.value = 0;
				}
			}

			async function fetchParticleBuffer(): Promise<Float32Array<ArrayBuffer> | undefined> {
				if (device.value) {
					const readBuffer = device.value.createBuffer({
						usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
						size: MAX_PARTICLES * PARTICLE_STRIDE,
					});

					const size = particleCount.value * PARTICLE_STRIDE;
					const commandEncoder = device.value.createCommandEncoder();
					commandEncoder.copyBufferToBuffer(particleInBuffer.value, 0, readBuffer, 0, size);
					device.value.queue.submit([commandEncoder.finish()]);

					await readBuffer.mapAsync(GPUMapMode.READ);
					const arrayBuffer = readBuffer.getMappedRange();
					const data = new Float32Array(arrayBuffer.slice(0));
					readBuffer.unmap();
					readBuffer.destroy();
					return data;
				}
			}

			function saveParticleBuffer(data: Float32Array<ArrayBuffer>) {
				if (device.value) {
					device.value.queue.writeBuffer(particleInBuffer.value, 0, data);
				}
			}

			return {
				update,
				render,
				spawnParticle,
				spawnParticles,
				clearParticles,
				buffers: {
					particleCountBuffer,
					gravityBuffer,
					boundsBuffer,
				}
			};
		}
	});

	watchEffect(() => {
		if (!device.value) {
			particleCount.value = 0;
		}
	});

	watchEffect(() => {
		if (device.value && particles.value) {
			device.value.queue.writeBuffer(particles.value.buffers.particleCountBuffer, 0, new Uint32Array([particleCount.value]));
			device.value.queue.writeBuffer(particles.value.buffers.boundsBuffer, 0, new Float32Array([bounds.width, bounds.height]));
			device.value.queue.writeBuffer(particles.value.buffers.gravityBuffer, 0, new Float32Array([
				gravity.strength * Math.cos((gravity.angle + 90) * (Math.PI / 180)),
				gravity.strength * Math.sin((gravity.angle + 90) * (Math.PI / 180)),
			]));
		}
	});

	function update() {
		particles.value?.update();
	}

	function render() {
		particles.value?.render();
	}

	function spawnParticle(x?: number, y?: number) {
		particles.value?.spawnParticle(x, y);
	}

	function spawnParticles(count: number, x?: number, y?: number) {
		particles.value?.spawnParticles(count, x, y);
	}

	function clearParticles() {
		particles.value?.clearParticles();
	}

	return {
		controls,
		ctx,
		radius,
		color,
		bounds,
		gravity,
		options,
		particleCount,
		spawnParticle,
		spawnParticles,
		clearParticles,
	};
});
