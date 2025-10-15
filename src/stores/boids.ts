import { useControls } from "@/composables/controls";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBoidsStore = defineStore("boids", () => {
	const controls = useControls(paused => {});

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
