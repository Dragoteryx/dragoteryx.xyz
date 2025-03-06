use std::ops::*;

#[derive(Default, Debug, Clone, Copy, PartialEq, PartialOrd)]
pub struct Vector {
	pub x: f32,
	pub y: f32,
}

#[allow(dead_code)]
impl Vector {
	pub const ORIGIN: Self = Self::new(0.0, 0.0);
	pub const UP: Self = Self::new(0.0, -1.0);
	pub const DOWN: Self = Self::new(0.0, 1.0);
	pub const LEFT: Self = Self::new(1.0, 0.0);
	pub const RIGHT: Self = Self::new(-1.0, 0.0);

	pub const fn new(x: f32, y: f32) -> Self {
		Self { x, y }
	}

	pub const fn splat(v: f32) -> Self {
		Self::new(v, v)
	}

	pub fn from_angle(angle: f32) -> Self {
		let angle = angle.to_radians();
		Self::new(angle.cos(), angle.sin())
	}

	pub fn distance_sqr(self, other: Self) -> f32 {
		(self.x - other.x).powi(2) + (self.y - other.y).powi(2)
	}

	pub fn distance(self, other: Self) -> f32 {
		self.distance_sqr(other).sqrt()
	}

	pub fn length_sqr(self) -> f32 {
		self.distance_sqr(Self::ORIGIN)
	}

	pub fn length(self) -> f32 {
		self.distance(Self::ORIGIN)
	}

	pub fn normal(self) -> Option<Self> {
		let length = self.length();
		if length != 0.0 {
			Some(self / length)
		} else {
			None
		}
	}

	pub fn normal_or(self, other: Self) -> Self {
		self.normal().unwrap_or(other)
	}

	pub fn normal_or_else<F: FnOnce() -> Self>(self, f: F) -> Self {
		self.normal().unwrap_or_else(f)
	}

	pub fn normal_or_default(self) -> Self {
		self.normal().unwrap_or_default()
	}

	pub fn dot(self, other: Vector) -> f32 {
		self.length() * other.length() * (self.angle() - other.angle()).to_radians().cos()
	}

	pub fn angle(self) -> f32 {
		self.y.atan2(self.x).to_degrees()
	}

	pub fn rotate(self, angle: f32) -> Self {
		Self::from_angle(self.angle() + angle) * self.length()
	}

	pub fn calc_area(self, size: usize) -> (usize, usize) {
		let x = self.x as usize;
		let y = self.y as usize;
		(x / size, y / size)
	}
}

impl Add for Vector {
	type Output = Self;

	fn add(self, rhs: Self) -> Self::Output {
		Self {
			x: self.x + rhs.x,
			y: self.y + rhs.y,
		}
	}
}

impl AddAssign for Vector {
	fn add_assign(&mut self, rhs: Self) {
		self.x += rhs.x;
		self.y += rhs.y;
	}
}

impl Sub for Vector {
	type Output = Self;

	fn sub(self, rhs: Self) -> Self::Output {
		Self {
			x: self.x - rhs.x,
			y: self.y - rhs.y,
		}
	}
}

impl SubAssign for Vector {
	fn sub_assign(&mut self, rhs: Self) {
		self.x -= rhs.x;
		self.y -= rhs.y;
	}
}

impl Mul for Vector {
	type Output = Self;

	fn mul(self, rhs: Self) -> Self::Output {
		Self {
			x: self.x * rhs.x,
			y: self.y * rhs.y,
		}
	}
}

impl MulAssign for Vector {
	fn mul_assign(&mut self, rhs: Self) {
		self.x *= rhs.x;
		self.y *= rhs.y;
	}
}

impl Mul<f32> for Vector {
	type Output = Self;

	fn mul(self, rhs: f32) -> Self::Output {
		Self {
			x: self.x * rhs,
			y: self.y * rhs,
		}
	}
}

impl MulAssign<f32> for Vector {
	fn mul_assign(&mut self, rhs: f32) {
		self.x *= rhs;
		self.y *= rhs;
	}
}

impl Div for Vector {
	type Output = Self;

	fn div(self, rhs: Self) -> Self::Output {
		Self {
			x: self.x / rhs.x,
			y: self.y / rhs.y,
		}
	}
}

impl DivAssign for Vector {
	fn div_assign(&mut self, rhs: Self) {
		self.x /= rhs.x;
		self.y /= rhs.y;
	}
}

impl Div<f32> for Vector {
	type Output = Self;

	fn div(self, rhs: f32) -> Self::Output {
		Self {
			x: self.x / rhs,
			y: self.y / rhs,
		}
	}
}

impl DivAssign<f32> for Vector {
	fn div_assign(&mut self, rhs: f32) {
		self.x /= rhs;
		self.y /= rhs;
	}
}

impl Neg for Vector {
	type Output = Self;

	fn neg(self) -> Self::Output {
		Self {
			x: -self.x,
			y: -self.y,
		}
	}
}
