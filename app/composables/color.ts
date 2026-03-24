import { computed, type Ref, type WritableComputedRef } from "vue";

export function useRgb(color: Ref<Color>): WritableComputedRef<Rgb> {
	return computed({
		get: () => color.value.rgb,
		set(value) {
			color.value = value;
		},
	});
}

export function useHsl(color: Ref<Color>): WritableComputedRef<Hsl> {
	return computed({
		get: () => color.value.hsl,
		set(value) {
			color.value = value;
		},
	});
}

export function useHsv(color: Ref<Color>): WritableComputedRef<Hsv> {
	return computed({
		get: () => color.value.hsv,
		set(value) {
			color.value = value;
		},
	});
}

export function useHwb(color: Ref<Color>): WritableComputedRef<Hwb> {
	return computed({
		get: () => color.value.hwb,
		set(value) {
			color.value = value;
		},
	});
}

export function useCmyk(color: Ref<Color>): WritableComputedRef<Cmyk> {
	return computed({
		get: () => color.value.cmyk,
		set(value) {
			color.value = value;
		},
	});
}
