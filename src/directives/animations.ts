import type { DirectiveBinding } from "vue";

export function vHover(el: HTMLElement, binding: DirectiveBinding) {
	el.addEventListener(
		"mouseenter",
		() => el.classList.add(`animate__${binding.arg}`),
	);
	el.addEventListener(
		"mouseleave",
		() => el.classList.remove(`animate__${binding.arg}`),
	);

	el.classList.add("animate__animated");
	if (binding.modifiers.repeat) {
		el.classList.add("animate__infinite");
	}
}

export function vToggle(el: HTMLElement, binding: DirectiveBinding<boolean>) {
	el.classList.add("animate__animated");
	el.classList.add("animate__infinite");

	if (binding.value) {
		el.classList.add(`animate__${binding.arg}`);
	} else {
		el.classList.remove(`animate__${binding.arg}`);
	}
}
