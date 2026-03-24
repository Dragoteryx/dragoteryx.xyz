export const useBoidsStore = defineStore("boids", () => {
	const controls = useControls(60, paused => {});

	const ctx = ref<CanvasRenderingContext2D>();
	const height = ref(0);
	const width = ref(0);

	return {
		controls,
		ctx,
		height,
		width,
	};
});
