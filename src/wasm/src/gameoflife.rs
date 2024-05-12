use std::collections::HashMap;
use std::fmt::{self, Debug};
use std::mem::replace;
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

#[wasm_bindgen]
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct GameOfLife {
	cells: HashMap<(i32, i32), Cell>,
}

#[wasm_bindgen]
impl GameOfLife {
	#[wasm_bindgen(constructor)]
	pub fn new() -> Self {
		Self {
			cells: HashMap::new(),
		}
	}

	pub fn is_alive(&self, x: i32, y: i32) -> bool {
		self.cells.get(&(x, y)).map_or(false, |cell| cell.is_alive())
	}

	pub fn birth_cell(&mut self, x: i32, y: i32) -> bool {
		let cell = self.cells.entry((x, y)).or_insert_with(Cell::new);
		if !cell.is_alive() {
			cell.set_alive(true);
			self.cells.entry((x - 1, y - 1)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x - 1, y)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x - 1, y + 1)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x, y - 1)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x, y + 1)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x + 1, y - 1)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x + 1, y)).or_insert_with(Cell::new).add_neighbor();
			self.cells.entry((x + 1, y + 1)).or_insert_with(Cell::new).add_neighbor();
			true
		} else {
			false
		}
	}

	pub fn kill_cell(&mut self, x: i32, y: i32) -> bool {
		if let Some(cell) = self.cells.get_mut(&(x, y)) {
			if cell.is_alive() {
				cell.set_alive(false);
				self.cells.entry((x - 1, y - 1)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x - 1, y)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x - 1, y + 1)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x, y - 1)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x, y + 1)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x + 1, y - 1)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x + 1, y)).or_insert_with(Cell::new).remove_neighbor();
				self.cells.entry((x + 1, y + 1)).or_insert_with(Cell::new).remove_neighbor();
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
		let cells = replace(&mut self.cells, HashMap::with_capacity(cells_len));
		for ((x, y), cell) in cells {
			if cell.becomes_alive() {
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
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Cell {
	data: u8,
}

impl Cell {
	pub fn new() -> Self {
		Self {
			data: 0,
		}
	}

	pub fn is_alive(&self) -> bool {
		self.data & 0b10000000 != 0
	}

	pub fn set_alive(&mut self, alive: bool) {
		if alive {
			self.data |= 0b10000000;
		} else {
			self.data &= 0b01111111;
		}
	}

	pub fn becomes_alive(&self) -> bool {
		match self.neighbors() {
			2 => self.is_alive(),
			3 => true,
			_ => false,
		}
	}

	pub fn neighbors(&self) -> u8 {
		self.data & 0b01111111
	}

	pub fn add_neighbor(&mut self) {
		self.data += 1;
	}

	pub fn remove_neighbor(&mut self) {
		self.data -= 1;
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