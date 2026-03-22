import convert from "color-convert";

export interface Color {
	readonly hex: string;
	readonly rgb: Rgb;
	readonly hsl: Hsl;
	readonly hsv: Hsv;
	readonly hwb: Hwb;
	readonly cmyk: Cmyk;
}

export class Rgb implements Color {
	public readonly r: number;
	public readonly g: number;
	public readonly b: number;

	public constructor(r: number, g: number, b: number) {
		this.r = Math.min(Math.max(Math.floor(r), 0), 255);
		this.g = Math.min(Math.max(Math.floor(g), 0), 255);
		this.b = Math.min(Math.max(Math.floor(b), 0), 255);
	}

	public get hex() {
		return `#${convert.rgb.hex(this.r, this.g, this.b)}`;
	}

	public get rgb() {
		return this;
	}

	public get hsl() {
		const [h, s, l] = convert.rgb.hsl(this.r, this.g, this.b);
		return new Hsl(h, s, l);
	}

	public get hsv() {
		const [h, s, v] = convert.rgb.hsv(this.r, this.g, this.b);
		return new Hsv(h, s, v);
	}

	public get hwb() {
		const [h, w, b] = convert.rgb.hwb(this.r, this.g, this.b);
		return new Hwb(h, w, b);
	}

	public get cmyk() {
		const [c, m, y, k] = convert.rgb.cmyk(this.r, this.g, this.b);
		return new Cmyk(c, m, y, k);
	}
}

export class Hsl implements Color {
	public readonly h: number;
	public readonly s: number;
	public readonly l: number;

	public constructor(h: number, s: number, l: number) {
		this.s = Math.min(Math.max(Math.floor(s), 0), 100);
		this.l = Math.min(Math.max(Math.floor(l), 0), 100);
		this.h = Math.floor(h) % 360;
	}

	public get hex() {
		return `#${convert.hsl.hex(this.h, this.s, this.l)}`;
	}

	public get rgb() {
		const [r, g, b] = convert.hsl.rgb(this.h, this.s, this.l);
		return new Rgb(r, g, b);
	}

	public get hsl() {
		return this;
	}

	public get hsv() {
		const [h, s, v] = convert.hsl.hsv(this.h, this.s, this.l);
		return new Hsv(h, s, v);
	}

	public get hwb() {
		const [h, w, b] = convert.hsl.hwb(this.h, this.s, this.l);
		return new Hwb(h, w, b);
	}

	public get cmyk() {
		const [c, m, y, k] = convert.hsl.cmyk(this.h, this.s, this.l);
		return new Cmyk(c, m, y, k);
	}
}

export class Hsv implements Color {
	public readonly h: number;
	public readonly s: number;
	public readonly v: number;

	public constructor(h: number, s: number, v: number) {
		this.s = Math.min(Math.max(Math.floor(s), 0), 100);
		this.v = Math.min(Math.max(Math.floor(v), 0), 100);
		this.h = Math.floor(h) % 360;
	}

	public get hex() {
		return `#${convert.hsv.hex(this.h, this.s, this.v)}`;
	}

	public get rgb() {
		const [r, g, b] = convert.hsv.rgb(this.h, this.s, this.v);
		return new Rgb(r, g, b);
	}

	public get hsl() {
		const [h, s, l] = convert.hsv.hsl(this.h, this.s, this.v);
		return new Hsl(h, s, l);
	}

	public get hsv() {
		return this;
	}

	public get hwb() {
		const [h, w, b] = convert.hsv.hwb(this.h, this.s, this.v);
		return new Hwb(h, w, b);
	}

	public get cmyk() {
		const [c, m, y, k] = convert.hsv.cmyk(this.h, this.s, this.v);
		return new Cmyk(c, m, y, k);
	}
}

export class Hwb implements Color {
	public readonly h: number;
	public readonly w: number;
	public readonly b: number;

	public constructor(h: number, w: number, b: number) {
		this.w = Math.min(Math.max(Math.floor(w), 0), 100);
		this.b = Math.min(Math.max(Math.floor(b), 0), 100);
		this.h = Math.floor(h) % 360;
	}

	public get hex() {
		return `#${convert.hwb.hex(this.h, this.w, this.b)}`;
	}

	public get rgb() {
		const [r, g, b] = convert.hwb.rgb(this.h, this.w, this.b);
		return new Rgb(r, g, b);
	}

	public get hsl() {
		const [h, s, l] = convert.hwb.hsl(this.h, this.w, this.b);
		return new Hsl(h, s, l);
	}

	public get hsv() {
		const [h, s, v] = convert.hwb.hsv(this.h, this.w, this.b);
		return new Hsv(h, s, v);
	}

	public get hwb() {
		return this;
	}

	public get cmyk() {
		const [c, m, y, k] = convert.hwb.cmyk(this.h, this.w, this.b);
		return new Cmyk(c, m, y, k);
	}
}

export class Cmyk implements Color {
	public readonly c: number;
	public readonly m: number;
	public readonly y: number;
	public readonly k: number;

	public constructor(c: number, m: number, y: number, k: number) {
		this.c = Math.min(Math.max(Math.floor(c), 0), 100);
		this.m = Math.min(Math.max(Math.floor(m), 0), 100);
		this.y = Math.min(Math.max(Math.floor(y), 0), 100);
		this.k = Math.min(Math.max(Math.floor(k), 0), 100);
	}

	public get hex() {
		return `#${convert.cmyk.hex(this.c, this.m, this.y, this.k)}`;
	}

	public get rgb() {
		const [r, g, b] = convert.cmyk.rgb(this.c, this.m, this.y, this.k);
		return new Rgb(r, g, b);
	}

	public get hsl() {
		const [h, s, l] = convert.cmyk.hsl(this.c, this.m, this.y, this.k);
		return new Hsl(h, s, l);
	}

	public get hsv() {
		const [h, s, v] = convert.cmyk.hsv(this.c, this.m, this.y, this.k);
		return new Hsv(h, s, v);
	}

	public get hwb() {
		const [h, w, b] = convert.cmyk.hwb(this.c, this.m, this.y, this.k);
		return new Hwb(h, w, b);
	}

	public get cmyk() {
		return this;
	}
}
