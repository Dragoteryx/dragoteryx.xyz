import { useMiscStore } from "@/stores/misc";
import { type DirectiveBinding, watchEffect } from "vue";

export function vResponsive(el: HTMLElement, binding: DirectiveBinding) {
	const miscStore = useMiscStore();

	const column = binding.modifiers.column && !binding.modifiers.row;
	const row = binding.modifiers.row && !binding.modifiers.column;

	watchEffect(() => {
		el.classList.remove("column", "row");
		if (miscStore.responsive) {
			if (column) el.classList.add("row");
			else if (row) el.classList.add("column");
		} else {
			if (column) el.classList.add("column");
			else if (row) el.classList.add("row");
		}
	});
}