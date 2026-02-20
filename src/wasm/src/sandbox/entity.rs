use std::cell::Cell;
use super::*;

#[derive(Debug, Clone, PartialEq)]
pub struct Entity {
	cur_pos: Cell<Vec2>,
	prev_pos: Cell<Vec2>,
	shape: Shape,
	color: Color,
}

impl Entity {
	pub fn circle(pos: Vec2, radius: f32, color: Color) -> Self {
		Self {
			cur_pos: Cell::new(pos),
			prev_pos: Cell::new(pos),
			shape: Shape::circle(radius),
			color,
		}
	}

	pub fn pos(&self) -> Vec2 {
		self.cur_pos.get()
	}

	pub fn vel(&self, dt: f32) -> Vec2 {
		(self.cur_pos.get() - self.prev_pos.get()) / dt
	}

	pub fn size(&self) -> f32 {
		let Shape::Circle { radius } = self.shape;
		radius * 2.0
	}

	pub fn bounds(&self) -> (Vec2, Vec2) {
		let (min, max) = self.shape.bounds();
		(self.pos() + min, self.pos() + max)
	}

	pub fn distance(&self, other: &Self) -> f32 {
		let Shape::Circle { radius: radius1 } = self.shape;
		let Shape::Circle { radius: radius2 } = other.shape;
		self.pos().distance(other.pos()) - radius1 - radius2
	}

	pub fn tick(&self, gravity: Vec2, dt: f32) {
		let Self { cur_pos, prev_pos, .. } = self;
		let cur_pos = cur_pos.get();
		let prev_pos = prev_pos.get();
		let next_pos = cur_pos + (cur_pos - prev_pos) + gravity * delta_time(dt).powi(2);
		self.prev_pos.set(cur_pos);
		self.cur_pos.set(next_pos);
	}

	pub fn draw(&self, ctx: &CanvasRenderingContext2d) {
		let Self { cur_pos, shape, color, .. } = self;
		shape.draw(ctx, cur_pos.get(), *color);
	}

	pub fn handle_collisions(&self, other: &Self) {
		let Shape::Circle { radius: radius1 } = self.shape;
		let Shape::Circle { radius: radius2 } = other.shape;
		let axis = other.pos() - self.pos();
		let dist = axis.length();
		if dist < radius1 + radius2 {
			let delta = radius1 + radius2 - dist;
			let normal = axis.normalize_or_zero();
			self.cur_pos.set(self.pos() - normal * delta * 0.25);
			other.cur_pos.set(other.pos() + normal * delta * 0.25);
		}
	}

	pub fn handle_world_collisions(&self, world_size: Vec2) {
		let bounds = self.bounds();

		if bounds.0.x < 0.0 {
			self.cur_pos.set(self.pos() + Vec2::new(-bounds.0.x, 0.0));
		} else if bounds.1.x > world_size.x {
			self.cur_pos.set(self.pos() + Vec2::new(world_size.x - bounds.1.x, 0.0));
		}

		if bounds.0.y < 0.0 {
			self.cur_pos.set(self.pos() + Vec2::new(0.0, -bounds.0.y));
		} else if bounds.1.y > world_size.y {
			self.cur_pos.set(self.pos() + Vec2::new(0.0, world_size.y - bounds.1.y));
		}
	}

	pub fn calc_area(&self, size: usize) -> (usize, usize) {
		let x = self.pos().x as usize;
		let y = self.pos().y as usize;
		(x / size, y / size)
	}
}