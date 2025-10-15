import convert from "color-convert";

export interface Color {
	readonly hex: string;
	readonly rgb: Rgb;
	readonly hsl: Hsl;
	readonly hsv: Hsv;
	readonly hwb: Hwb;
}

export class Rgb implements Color {
	public readonly r: number;
	public readonly g: number;
	public readonly b: number;

	public constructor(r: number, g: number, b: number) {
		this.r = Math.min(255, Math.max(0, Math.floor(r)));
		this.g = Math.min(255, Math.max(0, Math.floor(g)));
		this.b = Math.min(255, Math.max(0, Math.floor(b)));
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
}

export class Hsl implements Color {
	public readonly h: number;
	public readonly s: number;
	public readonly l: number;

	public constructor(h: number, s: number, l: number) {
		this.s = Math.min(100, Math.max(0, Math.floor(s)));
		this.l = Math.min(100, Math.max(0, Math.floor(l)));
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
}

export class Hsv implements Color {
	public readonly h: number;
	public readonly s: number;
	public readonly v: number;

	public constructor(h: number, s: number, v: number) {
		this.s = Math.min(100, Math.max(0, Math.floor(s)));
		this.v = Math.min(100, Math.max(0, Math.floor(v)));
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
}

export class Hwb implements Color {
	public readonly h: number;
	public readonly w: number;
	public readonly b: number;

	public constructor(h: number, w: number, b: number) {
		this.w = Math.min(100, Math.max(0, Math.floor(w)));
		this.b = Math.min(100, Math.max(0, Math.floor(b)));
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
}