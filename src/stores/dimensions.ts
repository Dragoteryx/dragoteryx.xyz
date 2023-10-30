import { useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useDimensionsStore = defineStore("dimensions", () => {
	const windowSize = useWindowSize();
	const windowWidth = computed(() => windowSize.width.value);
	const windowHeight = computed(() => windowSize.height.value);
	const asideMenuWidth = ref(0);
	const sandboxMenuWidth = ref(0);

	return {
		windowWidth,
		windowHeight,
		asideMenuWidth,
		sandboxMenuWidth, 
	};
});