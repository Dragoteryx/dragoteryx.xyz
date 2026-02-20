use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;
use glam::Vec2;

mod entity;
use entity::*;

mod util;
use util::*;

pub const SUB_STEPS: usize = 16;

pub fn delta_time(dt: f32) -> f32 {
	dt / SUB_STEPS as f32
}

#[wasm_bindgen]
#[derive(Default, Debug, Clone, PartialEq)]
pub struct Sandbox {
	entities: Vec<Entity>,
	console_logs: bool,
	world_size: Vec2,
	gravity_strength: f32,
	gravity_angle: f32,
	color: Color,
}

#[wasm_bindgen]
impl Sandbox {
	#[wasm_bindgen(constructor)]
	pub fn new() -> Self {
		Self {
			entities: Vec::new(),
			console_logs: false,
			world_size: Vec2::ZERO,
			gravity_strength: 981.0,
			gravity_angle: 0.0,
			color: Color {
				r: 0,
				g: 0,
				b: 0,
			},
		}
	}

	#[wasm_bindgen(getter)]
	pub fn console_logs(&self) -> bool {
		self.console_logs
	}

	#[wasm_bindgen(setter)]
	pub fn set_console_logs(&mut self, console_logs: bool) {
		self.console_logs = console_logs;
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
	pub fn set_gravity_strength(&mut self, strength: f32) {
		self.gravity_strength = strength;
	}

	#[wasm_bindgen(getter)]
	pub fn gravity_angle(&self) -> f32 {
		self.gravity_angle
	}

	#[wasm_bindgen(setter)]
	pub fn set_gravity_angle(&mut self, angle: f32) {
		self.gravity_angle = angle;
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

	pub fn add_circle(&mut self, x: f32, y: f32, radius: f32) {
		self.entities.push(Entity::circle(Vec2::new(x, y), radius, self.color));
	}

	pub fn clear_entities(&mut self) {
		self.entities.clear();
	}

	pub fn draw(&self, ctx: &CanvasRenderingContext2d) {
		for entity in &self.entities {
			entity.draw(ctx);
		}
	}

	pub fn tick(&self, dt: f32) {
		if self.console_logs {
			console_log!("=== TICK ===");
		}

		if self.entities.is_empty() {
			if self.console_logs {
				console_log!("No entities");
			}
			return;
		}

		let area_size = self.entities.iter()
			.map(|ent| (ent.size() + 1.0) as usize * 2)
			.max()
			.unwrap_or_default();

		if self.console_logs {
			console_log!("Area size: {}", area_size);
		}

		let mut areas: HashMap<_, Vec<_>> = HashMap::new();
		for ent in &self.entities {
			let area = ent.calc_area(area_size);
			areas.entry(area).or_default().push(ent);
		}

		if self.console_logs {
			console_log!("Areas: {}", areas.len());
			console_log!("Average area population: {}", self.entities.len() / areas.len());
		}

		let mut possible_collisions = Vec::new();
		for (&(x, y), entities) in &areas {
			let neighbor_iters = [
				areas.get(&(x, y)),
				areas.get(&(x + 1, y)),
				areas.get(&(x, y + 1)),
				areas.get(&(x + 1, y + 1)),
				areas.get(&(x + 1, y - 1)),
			];

			for (i, &ent1) in entities.iter().enumerate() {
				for &ent2 in neighbor_iters.iter().flatten().flat_map(|v| v.iter()).skip(i + 1) {
					let distance = ent1.distance(ent2);
					if distance < ent1.vel(dt).length() || distance < ent2.vel(dt).length() {
						possible_collisions.push((ent1, ent2));
					}
				}
			}
		}

		if self.console_logs {
			console_log!("Possible collisions: {}", possible_collisions.len());
		}

		let angle = (self.gravity_angle + 90.0).to_radians();
		let gravity = Vec2::from_angle(angle) * self.gravity_strength;
		for _ in 0..SUB_STEPS {
			for &(ent1, ent2) in &possible_collisions {
				ent1.handle_collisions(ent2);
			}

			for ent in &self.entities {
				ent.handle_world_collisions(self.world_size);
				ent.tick(gravity, dt);
			}
		}
	}
}
