use super::{Aabb, Collider, Color};
use glam::Vec2;
use std::cell::Cell;
use std::rc::Rc;
use std::sync::atomic::{AtomicUsize, Ordering};
use web_sys::CanvasRenderingContext2d;

#[derive(Debug, Clone, PartialEq)]
pub struct Entity(Rc<EntityData>);
#[derive(Debug, Clone, PartialEq)]
struct EntityData {
	id: usize,
	curr_pos: Cell<Vec2>,
	prev_pos: Cell<Vec2>,
	collider: Collider,
	color: Color,
}

impl Entity {
	pub fn circle(pos: Vec2, radius: f32, color: Color) -> Self {
		static ID_COUNTER: AtomicUsize = AtomicUsize::new(0);
		let id = ID_COUNTER.fetch_add(1, Ordering::Relaxed);
		let collider = Collider::Circle { radius };
		Entity(Rc::new(EntityData {
			curr_pos: Cell::new(pos),
			prev_pos: Cell::new(pos),
			collider,
			color,
			id,
		}))
	}

	pub fn id(&self) -> usize {
		self.0.id
	}

	pub fn aabb(&self) -> Aabb {
		self.0.collider.calc_aabb(self.0.curr_pos.get())
	}

	pub fn update(&self, gravity: Vec2, dt: f32) {
		let (curr_pos, prev_pos) = (self.0.curr_pos.get(), self.0.prev_pos.get());
		let next_pos = curr_pos + (curr_pos - prev_pos) + gravity * dt * dt;
		self.0.prev_pos.set(self.0.curr_pos.get());
		self.0.curr_pos.set(next_pos);
	}

	pub fn solve_collision(&self, other: &Entity) {
		let Collider::Circle { radius: radius1 } = self.0.collider;
		let Collider::Circle { radius: radius2 } = other.0.collider;
		let pos1 = self.0.curr_pos.get();
		let pos2 = other.0.curr_pos.get();
		let axis = pos1 - pos2;
		let dist = axis.length();
		if dist < radius1 + radius2 {
			let delta = radius1 + radius2 - dist;
			let normal = axis.normalize_or_zero();
			self.0.curr_pos.set(pos1 + normal * delta * 0.25);
			other.0.curr_pos.set(pos2 - normal * delta * 0.25);
		}
	}

	pub fn apply_world_boundaries(&self, world_size: Vec2) {
		let aabb = self.aabb();
		let pos = self.0.curr_pos.get();
		if aabb.min.x < 0.0 {
			self.0.curr_pos.set(Vec2::new(pos.x - aabb.min.x, pos.y));
		} else if aabb.max.x > world_size.x {
			self.0
				.curr_pos
				.set(Vec2::new(pos.x + world_size.x - aabb.max.x, pos.y));
		}

		let aabb = self.aabb();
		let pos = self.0.curr_pos.get();
		if aabb.min.y < 0.0 {
			self.0.curr_pos.set(Vec2::new(pos.x, pos.y - aabb.min.y));
		} else if aabb.max.y > world_size.y {
			self.0
				.curr_pos
				.set(Vec2::new(pos.x, pos.y + world_size.y - aabb.max.y));
		}
	}

	#[allow(deprecated)]
	pub fn draw(&self, ctx: &CanvasRenderingContext2d) {
		let pos = self.0.curr_pos.get();
		let Color { r, g, b } = self.0.color;
		ctx.set_fill_style(&format!("rgb({r}, {g}, {b})").into());
		ctx.set_stroke_style(&"black".into());
		match self.0.collider {
			Collider::Circle { radius } => {
				ctx.begin_path();
				ctx.arc(
					pos.x as f64,
					pos.y as f64,
					radius as f64,
					0.0,
					std::f64::consts::TAU,
				)
				.unwrap();
				ctx.fill();
				ctx.set_global_alpha(0.25);
				ctx.stroke();
				ctx.set_global_alpha(1.0);
			}
		}
	}
}
