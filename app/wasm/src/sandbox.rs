use glam::Vec2;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

mod aabb;
use aabb::*;

mod entity;
use entity::*;

mod util;
use util::*;

#[wasm_bindgen]
pub struct Sandbox2 {
	entities: Vec<Entity>,
	bvh: BvhTree,

	draw_volumes: bool,
	gravity_strength: f32,
	gravity_angle: f32,
	world_size: Vec2,
	color: Color,
}

#[wasm_bindgen]
impl Sandbox2 {
	#[wasm_bindgen(constructor)]
	pub fn new() -> Self {
		Self {
			entities: Vec::new(),
			gravity_strength: 981.0,
			gravity_angle: 0.0,
			world_size: Vec2::ZERO,
			color: Color::default(),
			bvh: BvhTree::Empty,
			draw_volumes: false,
		}
	}

	#[wasm_bindgen(getter)]
	pub fn draw_volumes(&self) -> bool {
		self.draw_volumes
	}

	#[wasm_bindgen(setter)]
	pub fn set_draw_volumes(&mut self, draw_volumes: bool) {
		self.draw_volumes = draw_volumes;
	}

	#[wasm_bindgen(getter)]
	pub fn world_width(&self) -> f32 {
		self.world_size.x
	}

	#[wasm_bindgen(setter)]
	pub fn set_world_width(&mut self, width: f32) {
		self.world_size.x = width;
	}

	#[wasm_bindgen(getter)]
	pub fn world_height(&self) -> f32 {
		self.world_size.y
	}

	#[wasm_bindgen(setter)]
	pub fn set_world_height(&mut self, height: f32) {
		self.world_size.y = height;
	}

	#[wasm_bindgen(getter)]
	pub fn gravity_strength(&self) -> f32 {
		self.gravity_strength
	}

	#[wasm_bindgen(setter)]
	pub fn set_gravity_strength(&mut self, gravity_strength: f32) {
		self.gravity_strength = gravity_strength;
	}

	#[wasm_bindgen(getter)]
	pub fn gravity_angle(&self) -> f32 {
		self.gravity_angle
	}

	#[wasm_bindgen(setter)]
	pub fn set_gravity_angle(&mut self, gravity_angle: f32) {
		self.gravity_angle = gravity_angle;
	}

	#[wasm_bindgen(getter)]
	pub fn color_r(&self) -> u8 {
		self.color.r
	}

	#[wasm_bindgen(setter)]
	pub fn set_color_r(&mut self, r: u8) {
		self.color.r = r;
	}

	#[wasm_bindgen(getter)]
	pub fn color_g(&self) -> u8 {
		self.color.g
	}

	#[wasm_bindgen(setter)]
	pub fn set_color_g(&mut self, g: u8) {
		self.color.g = g;
	}

	#[wasm_bindgen(getter)]
	pub fn color_b(&self) -> u8 {
		self.color.b
	}

	#[wasm_bindgen(setter)]
	pub fn set_color_b(&mut self, b: u8) {
		self.color.b = b;
	}

	#[wasm_bindgen(getter)]
	pub fn bvh_depth(&self) -> usize {
		self.bvh.depth()
	}

	pub fn build_bvh(&mut self) {
		self.bvh = BvhTree::build(&mut self.entities);
	}

	pub fn refit_bvh(&mut self) {
		self.bvh.refit();
	}

	pub fn add_circle(&mut self, x: f32, y: f32, radius: f32) {
		let entity = Entity::circle(Vec2::new(x, y), radius, self.color);
		self.bvh.insert(entity.clone());
		self.entities.push(entity);
	}

	pub fn clear_entities(&mut self) {
		self.entities.clear();
		self.bvh.clear();
	}

	pub fn draw(&mut self, ctx: &CanvasRenderingContext2d) {
		for ent in &self.entities {
			ent.draw(ctx);
		}

		if self.draw_volumes {
			self.bvh.draw(ctx);
		}
	}

	pub fn update(&mut self, delta_time: f32, sub_steps: u8) {
		let angle = (self.gravity_angle + 90.0).to_radians();
		let gravity = Vec2::from_angle(angle) * self.gravity_strength;
		let dt = delta_time / sub_steps as f32;

		self.build_bvh();
		for i in 0..sub_steps {
			for ent in &self.entities {
				ent.update(gravity, dt);
			}

			for ent1 in &self.entities {
				self.bvh.query(&ent1.aabb(), &mut |_, ent2| {
					if ent1.id() < ent2.id() {
						ent1.solve_collision(ent2);
					}
				});
			}

			for ent in &self.entities {
				ent.apply_world_boundaries(self.world_size);
			}

			if i < sub_steps - 1 {
				self.refit_bvh();
			}
		}
	}
}
