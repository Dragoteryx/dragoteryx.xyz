import { type Color, Hsl, Hsv, Hwb, Rgb } from "@/types/color";
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

export function useLocalStorageColor(name: string, defaultValue: Color): WritableComputedRef<Color> {
	const local = useLocalStorage(name, JSON.stringify(defaultValue));
	return computed({
		set(color) {
			local.value = JSON.stringify(color);
		},
		get() {
			try {
				const parsed: unknown = JSON.parse(local.value);
				if (typeof parsed == "object" && parsed != null) {
					if ("r" in parsed && "g" in parsed && "b" in parsed) {
						return new Rgb(Number(parsed["r"]), Number(parsed["g"]), Number(parsed["b"]));
					} else if ("h" in parsed && "s" in parsed && "l" in parsed) {
						return new Hsl(Number(parsed["h"]), Number(parsed["s"]), Number(parsed["l"]));
					} else if ("h" in parsed && "s" in parsed && "v" in parsed) {
						return new Hsv(Number(parsed["h"]), Number(parsed["s"]), Number(parsed["v"]));
					} else if ("h" in parsed && "w" in parsed && "b" in parsed) {
						return new Hwb(Number(parsed["h"]), Number(parsed["w"]), Number(parsed["b"]));
					}
				}
				return defaultValue;
			} catch {
				return defaultValue;
			}
		},
	});
}
