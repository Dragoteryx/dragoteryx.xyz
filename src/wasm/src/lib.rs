#![allow(clippy::new_without_default)]
#![forbid(unsafe_code)]

#[allow(unused_macros)]
macro_rules! console_log {
	($($t:tt)*) => {
		::web_sys::console::log_1(&format!($($t)*).into());
	}
}

#[allow(unused_macros)]
macro_rules! console_warn {
	($($t:tt)*) => {
		::web_sys::console::warn_1(&format!($($t)*).into());
	}
}

#[allow(unused_macros)]
macro_rules! console_error {
	($($t:tt)*) => {
		::web_sys::console::error_1(&format!($($t)*).into());
	}
}

pub mod gameoflife;

pub mod sandbox;