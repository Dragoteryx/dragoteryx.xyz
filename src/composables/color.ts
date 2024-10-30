import { Color, Hex, Rgb, Hsl, Hsv, toHex, toRgb, toHsl, toHsv } from "@/types/color";
import type { Ref, WritableComputedRef } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

export function useLocalStorageColor(name: string, defaultValue: Color): WritableComputedRef<Color> {
	const local = useLocalStorage(name, JSON.stringify(defaultValue));
	return computed({
		get: () => Color.parse(JSON.parse(local.value)),
		set(color) {
			local.value = JSON.stringify(color);
		}
	});
}

export function useHex(color: Ref<Color>): WritableComputedRef<Hex> {
	return computed({
		get: () => toHex(color.value),
		set(value) {
			color.value = Color.parse({
				type: "hex",
				value
			});
		}
	});
}

export function useRgb(color: Ref<Color>): WritableComputedRef<Rgb> {
	return computed({
		get: () => toRgb(color.value),
		set(value) {
			color.value = Color.parse({
				type: "rgb",
				value
			});
		}
	});
}

export function useHsl(color: Ref<Color>): WritableComputedRef<Hsl> {
	return computed({
		get: () => toHsl(color.value),
		set(value) {
			color.value = Color.parse({
				type: "hsl",
				value
			});
		}
	});
}

export function useHsv(color: Ref<Color>): WritableComputedRef<Hsv> {
	return computed({
		get: () => toHsv(color.value),
		set(value) {
			color.value = Color.parse({
				type: "hsv",
				value
			});	
		}
	});
}