import { computed, type Ref, type WritableComputedRef } from "vue";

export function useRgb(color: Ref<Color>): WritableComputedRef<Rgb> {
	return useColorConvert("rgb", color);
}

export function useHsl(color: Ref<Color>): WritableComputedRef<Hsl> {
	return useColorConvert("hsl", color);
}

export function useHsv(color: Ref<Color>): WritableComputedRef<Hsv> {
	return useColorConvert("hsv", color);
}

export function useHwb(color: Ref<Color>): WritableComputedRef<Hwb> {
	return useColorConvert("hwb", color);
}

export function useCmyk(color: Ref<Color>): WritableComputedRef<Cmyk> {
	return useColorConvert("cmyk", color);
}

export function useColorConvert<T extends Color.Type>(type: T, color: Ref<Color>) {
	return computed({
		get: () => color.value[type],
		set(value) {
			color.value = value;
		},
	});
}
