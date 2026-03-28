use super::Entity;
use glam::Vec2;
use web_sys::CanvasRenderingContext2d;

#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Aabb {
	pub min: Vec2,
	pub max: Vec2,
}

impl Default for Aabb {
	fn default() -> Self {
		Self {
			min: Vec2::MAX,
			max: Vec2::MIN,
		}
	}
}

impl Aabb {
	pub fn centroid(&self) -> Vec2 {
		(self.min + self.max) * 0.5
	}

	pub fn surface_area(&self) -> f32 {
		let extents = self.max - self.min;
		2.0 * (extents.x * extents.y)
	}

	pub fn merge(&self, other: &Aabb) -> Aabb {
		Aabb {
			min: self.min.min(other.min),
			max: self.max.max(other.max),
		}
	}

	pub fn intersects(&self, other: &Aabb) -> bool {
		self.min.x < other.max.x
			&& self.max.x > other.min.x
			&& self.min.y < other.max.y
			&& self.max.y > other.min.y
	}
}

#[derive(Default, Debug, Clone, PartialEq)]
pub enum BvhTree {
	Node(Aabb, Box<BvhTree>, Box<BvhTree>),
	Leaf(Aabb, Entity),
	#[default]
	Empty,
}

impl BvhTree {
	#[rustfmt::skip]
	pub fn build(entities: &mut [Entity]) -> Self {
		match entities {
			[] => Self::Empty,
			[ent] => Self::Leaf(ent.aabb(), ent.clone()),
			_ => {
				let aabb = entities.iter().map(|ent| ent.aabb()).reduce(|acc, val| acc.merge(&val)).unwrap();
				let (dx, dy) = (aabb.max.x - aabb.min.x, aabb.max.y - aabb.min.y);
				entities.sort_unstable_by(|ent1, ent2| {
					let (aabb1, aabb2) = (ent1.aabb(), ent2.aabb());
					if dx >= dy {
						aabb1.centroid().x.partial_cmp(&aabb2.centroid().x).unwrap()
					} else {
						aabb1.centroid().y.partial_cmp(&aabb2.centroid().y).unwrap()
					}
				});

				let mid = entities.len() / 2;
				let left = Self::build(&mut entities[..mid]);
				let right = Self::build(&mut entities[mid..]);
				Self::Node(aabb, Box::new(left), Box::new(right))
			}
		}
	}

	pub fn aabb(&self) -> Aabb {
		match self {
			Self::Empty => Aabb::default(),
			Self::Node(aabb, _, _) => *aabb,
			Self::Leaf(aabb, _) => *aabb,
		}
	}

	pub fn depth(&self) -> usize {
		match self {
			Self::Node(_, l, r) => 1 + l.depth().max(r.depth()),
			Self::Leaf(_, _) => 1,
			Self::Empty => 0,
		}
	}

	pub fn insert(&mut self, ent: Entity) {
		let aabb = ent.aabb();
		match self {
			Self::Empty => {
				*self = Self::Leaf(aabb, ent);
			}
			Self::Leaf(leaf_aabb, leaf_ent) => {
				*self = Self::Node(
					leaf_aabb.merge(&aabb),
					Box::new(Self::Leaf(*leaf_aabb, leaf_ent.clone())),
					Box::new(Self::Leaf(aabb, ent)),
				);
			}
			Self::Node(node_aabb, left, right) => {
				*node_aabb = node_aabb.merge(&aabb);
				let left_cost = left.aabb().merge(&aabb).surface_area();
				let right_cost = right.aabb().merge(&aabb).surface_area();
				let left_delta = left_cost - left.aabb().surface_area();
				let right_delta = right_cost - right.aabb().surface_area();
				if left_delta <= right_delta {
					left.insert(ent);
				} else {
					right.insert(ent);
				}
			}
		}
	}

	pub fn refit(&mut self) {
		match self {
			Self::Empty => {}
			Self::Leaf(aabb, ent) => {
				*aabb = ent.aabb();
			}
			Self::Node(aabb, left, right) => {
				left.refit();
				right.refit();
				*aabb = left.aabb().merge(&right.aabb());
			}
		}
	}

	pub fn clear(&mut self) {
		*self = Self::Empty;
	}

	pub fn visit(&self, visitor: &impl Fn(Aabb, Option<&Entity>)) {
		match self {
			Self::Empty => {}
			Self::Leaf(aabb, ent) => {
				visitor(*aabb, Some(ent));
			}
			Self::Node(aabb, left, right) => {
				left.visit(visitor);
				right.visit(visitor);
				visitor(*aabb, None);
			}
		}
	}

	pub fn query(&self, aabb: &Aabb, visitor: &impl Fn(Aabb, &Entity)) {
		match self {
			Self::Empty => {}
			Self::Leaf(leaf_aabb, ent) => {
				if leaf_aabb.intersects(aabb) {
					visitor(*leaf_aabb, ent);
				}
			}
			Self::Node(node_aabb, left, right) => {
				if node_aabb.intersects(aabb) {
					left.query(aabb, visitor);
					right.query(aabb, visitor);
				}
			}
		}
	}

	#[allow(deprecated)]
	pub fn draw(&self, ctx: &CanvasRenderingContext2d) {
		self.visit(&|aabb, _| {
			ctx.set_stroke_style(&"black".into());
			ctx.stroke_rect(
				aabb.min.x as f64,
				aabb.min.y as f64,
				(aabb.max.x - aabb.min.x) as f64,
				(aabb.max.y - aabb.min.y) as f64,
			);
		});
	}
}
