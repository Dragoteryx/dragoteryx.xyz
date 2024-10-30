use super::*;

#[derive(Default, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Color {
	pub r: u8,
	pub g: u8,
	pub b: u8,
}

#[derive(Debug, Clone, Copy, PartialEq, PartialOrd)]
pub enum Shape {
	Circle { radius: f32 },
}

impl Shape {
	pub fn circle(radius: f32) -> Self {
		Self::Circle { radius }
	}

	#[allow(unused_must_use)]
	pub fn draw(&self, ctx: &CanvasRenderingContext2d, pos: Vector, color: Color) {
		let Self::Circle { radius } = *self;
		let Vector { x, y } = pos;
		let Color { r, g, b } = color;
		ctx.set_fill_style(&format!("rgb({r}, {g}, {b})").into());
		ctx.set_stroke_style(&"black".into());
		ctx.begin_path();
		ctx.arc(x as f64, y as f64, radius as f64, 0.0, 2.0 * std::f64::consts::PI);
		ctx.fill();
		ctx.set_global_alpha(0.25);
		ctx.stroke();
		ctx.set_global_alpha(1.0);
	}

	pub fn bounds(&self) -> (Vector, Vector) {
		let Self::Circle { radius } = *self;
		let radius = Vector::splat(radius);
		(-radius, radius)
	}
}