#![deny(unsafe_code)]

macro_rules! console_log {
	($($t:tt)*) => {
		::web_sys::console::log_1(&format!($($t)*).into());
	}
}

macro_rules! console_warn {
	($($t:tt)*) => {
		::web_sys::console::warn_1(&format!($($t)*).into());
	}
}

macro_rules! console_error {
	($($t:tt)*) => {
		::web_sys::console::error_1(&format!($($t)*).into());
	}
}

pub mod phys;