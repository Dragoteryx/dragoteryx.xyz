import { type Color, Hsl, Hsv, Hwb, Rgb, Cmyk } from "@/types/color";
import type { WritableComputedRef } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { computed, type Ref } from "vue";

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

export function useColorLocalStorage(name: string, value: Color): WritableComputedRef<Color> {
	const local = useLocalStorage<object>(name, value);
	return computed({
		set(value) {
			local.value = value;
		},
		get: () => {
			const arg = local.value;
			if ("r" in arg && "g" in arg && "b" in arg) {
				return new Rgb(Number(arg["r"]), Number(arg["g"]), Number(arg["b"]));
			} else if ("h" in arg && "s" in arg && "l" in arg) {
				return new Hsl(Number(arg["h"]), Number(arg["s"]), Number(arg["l"]));
			} else if ("h" in arg && "s" in arg && "v" in arg) {
				return new Hsv(Number(arg["h"]), Number(arg["s"]), Number(arg["v"]));
			} else if ("h" in arg && "w" in arg && "b" in arg) {
				return new Hwb(Number(arg["h"]), Number(arg["w"]), Number(arg["b"]));
			} else if ("c" in arg && "m" in arg && "y" in arg && "k" in arg) {
				return new Cmyk(Number(arg["c"]), Number(arg["m"]), Number(arg["y"]), Number(arg["k"]));
			}

			return value;
		},
	});
}
