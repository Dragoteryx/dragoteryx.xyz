import { useElementSize, useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useDimensionsStore = defineStore("dimensions", () => {
	const bodySize = useElementSize(document.body);
	const windowSize = useWindowSize();
	const windowWidth = computed(() => Math.max(bodySize.width.value, windowSize.width.value));
	const windowHeight = computed(() => Math.max(bodySize.height.value, windowSize.height.value));
	const asideMenuWidth = ref(0);
	const sandboxMenuWidth = ref(0);
	const gameOfLifeMenuWidth = ref(0);

	return {
		windowWidth,
		windowHeight,
		asideMenuWidth,
		sandboxMenuWidth, 
		gameOfLifeMenuWidth,
	};
});