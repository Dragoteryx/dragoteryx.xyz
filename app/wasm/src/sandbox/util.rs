use super::aabb::Aabb;
use glam::Vec2;

#[derive(Default, Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Color {
	pub r: u8,
	pub g: u8,
	pub b: u8,
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Collider {
	Circle { radius: f32 },
}

impl Collider {
	pub fn calc_aabb(&self, pos: Vec2) -> Aabb {
		match self {
			Collider::Circle { radius } => Aabb {
				min: pos - Vec2::splat(*radius),
				max: pos + Vec2::splat(*radius),
			},
		}
	}
}
