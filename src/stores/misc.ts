import { useWindowSize } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useMiscStore = defineStore("misc", () => {
	const windowSize = useWindowSize();
	const responsive = computed(() => windowSize.width.value < windowSize.height.value);
	const asideWidth = ref(Infinity);

	return { asideWidth, responsive };
});