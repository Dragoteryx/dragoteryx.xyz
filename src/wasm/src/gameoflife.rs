use ahash::AHashMap;
use js_sys::Function;
use std::fmt::{self, Debug};
use std::mem::replace;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

#[wasm_bindgen]
extern {
	#[wasm_bindgen(typescript_type = "(alive: boolean, neighbors: number) => boolean")]
	pub type NextStateCallback;
}

#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GameOfLife {
	cells: AHashMap<(i32, i32), Cell>,
	callback: Function,
}

#[wasm_bindgen]
impl GameOfLife {
	#[wasm_bindgen(constructor)]
	pub fn new(callback: NextStateCallback) -> Self {
		Self {
			cells: AHashMap::new(),
			callback: callback.unchecked_into(),
		}
	}

	#[wasm_bindgen(getter)]
	pub fn next_state_callback(&self) -> NextStateCallback {
		self.callback.clone().unchecked_into()
	}

	#[wasm_bindgen(setter)]
	pub fn set_next_state_callback(&mut self, callback: NextStateCallback) {
		self.callback = callback.unchecked_into();
	}

	pub fn is_alive(&self, x: i32, y: i32) -> bool {
		self.cells.get(&(x, y)).is_some_and(Cell::is_alive)
	}

	pub fn birth_cell(&mut self, x: i32, y: i32) -> bool {
		let cell = self.cells.entry((x, y)).or_default();
		if !cell.is_alive() {
			cell.set_alive(true);
			self.cells.entry((x - 1, y - 1)).or_default().add_neighbor();
			self.cells.entry((x - 1, y)).or_default().add_neighbor();
			self.cells.entry((x - 1, y + 1)).or_default().add_neighbor();
			self.cells.entry((x, y - 1)).or_default().add_neighbor();
			self.cells.entry((x, y + 1)).or_default().add_neighbor();
			self.cells.entry((x + 1, y - 1)).or_default().add_neighbor();
			self.cells.entry((x + 1, y)).or_default().add_neighbor();
			self.cells.entry((x + 1, y + 1)).or_default().add_neighbor();
			true
		} else {
			false
		}
	}

	pub fn kill_cell(&mut self, x: i32, y: i32) -> bool {
		if let Some(cell) = self.cells.get_mut(&(x, y)) {
			if cell.is_alive() {
				cell.set_alive(false);
				self.cells.entry((x - 1, y - 1)).or_default().remove_neighbor();
				self.cells.entry((x - 1, y)).or_default().remove_neighbor();
				self.cells.entry((x - 1, y + 1)).or_default().remove_neighbor();
				self.cells.entry((x, y - 1)).or_default().remove_neighbor();
				self.cells.entry((x, y + 1)).or_default().remove_neighbor();
				self.cells.entry((x + 1, y - 1)).or_default().remove_neighbor();
				self.cells.entry((x + 1, y)).or_default().remove_neighbor();
				self.cells.entry((x + 1, y + 1)).or_default().remove_neighbor();
				true
			} else {
				false
			}
		} else {
			false
		}
	}

	pub fn toggle_cell(&mut self, x: i32, y: i32) -> bool {
		if self.is_alive(x, y) {
			self.kill_cell(x, y);
			false
		} else {
			self.birth_cell(x, y);
			true
		}
	}
	
	pub fn clear(&mut self) {
		self.cells.clear();
	}

	pub fn tick(&mut self) -> usize {
		let mut alive = 0;
		let cells_len = self.cells.len();
		let mut cached = AHashMap::with_capacity(16);
		let cells = replace(&mut self.cells, AHashMap::with_capacity(cells_len));
		for ((x, y), cell) in cells {
			let is_alive = cell.is_alive();
			let neighbors = cell.neighbors();
			let should_live = cached.entry((is_alive, neighbors)).or_insert_with(|| {
				let is_alive = JsValue::from_bool(is_alive);
				let neighbors = JsValue::from_f64(neighbors as f64);
				let res = self.callback.call2(&JsValue::NULL, &is_alive, &neighbors);
				res.unwrap_or(JsValue::FALSE).is_truthy()
			});

			if *should_live {
				self.birth_cell(x, y);
				alive += 1;
			}
		}

		alive
	}

	pub fn draw(&self, ctx: &CanvasRenderingContext2d, color: &str, pos_x: f64, pos_y: f64, size: f64) {
		ctx.set_fill_style(&JsValue::from_str(color));
		for (&(x, y), cell) in &self.cells {
			if cell.is_alive() {
				ctx.fill_rect(
					(x as f64 * size) - pos_x,
					(y as f64 * size) - pos_y,
					size, size,
				);
			}
		}
	}
}

#[repr(transparent)]
#[derive(Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Cell {
	data: u8,
}

impl Cell {
	pub fn is_alive(&self) -> bool {
		self.state() > 0
	}

	pub fn set_alive(&mut self, alive: bool) {
		self.set_state(alive as _);
	}

	pub fn state(&self) -> u8 {
		self.data >> 4
	}

	pub fn set_state(&mut self, state: u8) {
		self.data = (state << 4) | self.neighbors();
	}

	pub fn neighbors(&self) -> u8 {
		self.data & 0b00001111
	}

	pub fn set_neighbors(&mut self, neighbors: u8) {
		self.data = (self.state() << 4) | neighbors.clamp(0, 8);
	}

	pub fn add_neighbor(&mut self) {
		self.set_neighbors(self.neighbors() + 1);
	}

	pub fn remove_neighbor(&mut self) {
		self.set_neighbors(self.neighbors() - 1);
	}
}

impl Debug for Cell {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		f.debug_struct("Cell")
			.field("alive", &self.is_alive())
			.field("neighbors", &self.neighbors())
			.finish()
	}
}