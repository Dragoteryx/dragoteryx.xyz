import convert from "color-convert";
import z from "zod";

export type Hue = z.infer<typeof Hue>;
export type Percent = z.infer<typeof Percent>;
export type Byte = z.infer<typeof Byte>;

export type Color = z.infer<typeof Color>;
export type Hex = z.infer<typeof Hex>;
export type Rgb = z.infer<typeof Rgb>;
export type Hsl = z.infer<typeof Hsl>;
export type Hsv = z.infer<typeof Hsv>;
export type Hwb = z.infer<typeof Hwb>;

export const Hex = z.string().regex(/^#[0-9a-f]{6}$/i)
	.or(z.string().regex(/^[0-9a-f]{6}$/i).transform(hex => `#${hex}`))
	.brand("Hex");

export const Byte = z.number().int().min(0).max(255).brand("Byte");
export const Hue = z.number().int().min(0).max(360).brand("Hue");
export const Percent = z.number().int().min(0).max(100).brand("Percent");

export const Rgb = z.object({
	r: Byte,
	g: Byte,
	b: Byte,
}).readonly();

export const Hsl = z.object({
	h: Hue,
	s: Percent,
	l: Percent,
}).readonly();

export const Hsv = z.object({
	h: Hue,
	s: Percent,
	v: Percent,
}).readonly();

export const Hwb = z.object({
	h: Hue,
	w: Percent,
	b: Percent,
}).readonly();

export const Color = z.union([
	z.object({
		type: z.literal("hex"),
		value: Hex,
	}),
	z.object({
		type: z.literal("rgb"),
		value: Rgb,
	}),
	z.object({
		type: z.literal("hsl"),
		value: Hsl,
	}),
	z.object({
		type: z.literal("hsv"),
		value: Hsv,
	}),
	z.object({
		type: z.literal("hwb"),
		value: Hwb,
	}),
]).readonly();

export function toColor(color: Hex | Rgb | Hsl | Hsv | Hwb): Color {
	if (typeof color === "string") {
		return {type: "hex", value: color};
	} else if ("r" in color) {
		return {type: "rgb", value: color};
	} else if ("l" in color) {
		return {type: "hsl", value: color};
	} else if ("v" in color) {
		return {type: "hsv", value: color};
	} else {
		return {type: "hwb", value: color};
	}
}

export function toHex(color: Color): Hex {
	switch (color.type) {
		case "hex":
			return color.value;
		case "rgb":
			return Hex.parse(convert.rgb.hex([color.value.r, color.value.g, color.value.b]));
		case "hsl":
			return Hex.parse(convert.hsl.hex([color.value.h, color.value.s, color.value.l]));
		case "hsv":
			return Hex.parse(convert.hsv.hex([color.value.h, color.value.s, color.value.v]));
		case "hwb":
			return Hex.parse(convert.hwb.hex([color.value.h, color.value.w, color.value.b]));
	}
}

export function toRgb(color: Color): Rgb {
	let [r, g, b] = [0, 0, 0];
	switch (color.type) {
		case "hex":
			[r, g, b] = convert.hex.rgb(color.value);
			return Rgb.parse({r, g, b});
		case "rgb":
			return color.value;
		case "hsl":
			[r, g, b] = convert.hsl.rgb([color.value.h, color.value.s, color.value.l]);
			return Rgb.parse({r, g, b});
		case "hsv":
			[r, g, b] = convert.hsv.rgb([color.value.h, color.value.s, color.value.v]);
			return Rgb.parse({r, g, b});
		case "hwb":
			[r, g, b] = convert.hwb.rgb([color.value.h, color.value.w, color.value.b]);
			return Rgb.parse({r, g, b});
	}	
}

export function toHsl(color: Color): Hsl {
	let [h, s, l] = [0, 0, 0];
	switch (color.type) {
		case "hex":
			[h, s, l] = convert.hex.hsl(color.value);
			return Hsl.parse({h, s, l});
		case "rgb":
			[h, s, l] = convert.rgb.hsl([color.value.r, color.value.g, color.value.b]);
			return Hsl.parse({h, s, l});
		case "hsl":
			return color.value;
		case "hsv":
			[h, s, l] = convert.hsv.hsl([color.value.h, color.value.s, color.value.v]);
			return Hsl.parse({h, s, l});
		case "hwb":
			[h, s, l] = convert.hwb.hsl([color.value.h, color.value.w, color.value.b]);
			return Hsl.parse({h, s, l});
	}
}

export function toHsv(color: Color): Hsv {
	let [h, s, v] = [0, 0, 0];
	switch (color.type) {
		case "hex":
			[h, s, v] = convert.hex.hsv(color.value);
			return Hsv.parse({h, s, v});
		case "rgb":
			[h, s, v] = convert.rgb.hsv([color.value.r, color.value.g, color.value.b]);
			return Hsv.parse({h, s, v});
		case "hsl":
			[h, s, v] = convert.hsl.hsv([color.value.h, color.value.s, color.value.l]);
			return Hsv.parse({h, s, v});
		case "hsv":
			return color.value;
		case "hwb":
			[h, s, v] = convert.hwb.hsv([color.value.h, color.value.w, color.value.b]);
			return Hsv.parse({h, s, v});
	}	
}

export function toHwb(color: Color): Hwb {
	let [h, w, b] = [0, 0, 0];
	switch (color.type) {
		case "hex":
			[h, w, b] = convert.hex.hwb(color.value);
			return Hwb.parse({h, w, b});
		case "rgb":
			[h, w, b] = convert.rgb.hwb([color.value.r, color.value.g, color.value.b]);
			return Hwb.parse({h, w, b});
		case "hsl":
			[h, w, b] = convert.hsl.hwb([color.value.h, color.value.s, color.value.l]);
			return Hwb.parse({h, w, b});
		case "hsv":
			[h, w, b] = convert.hsv.hwb([color.value.h, color.value.s, color.value.v]);
			return Hwb.parse({h, w, b});
		case "hwb":
			return color.value;
	}	
}