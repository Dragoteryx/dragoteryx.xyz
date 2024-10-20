import { computed, reactive, ref, type WritableComputedRef } from "vue";
import { useIntervalFn } from "@vueuse/core";

export interface Controls {
	active: boolean;
	paused: boolean;
	tick(): void;
}

export function useActive(update: () => void): WritableComputedRef<boolean> {
	const controls = useIntervalFn(update, 1000 / 60);
	return computed({
		get: () => controls.isActive.value,
		set(value) {
			if (value) controls.resume();
			else controls.pause();
		},
	});
}

export function useControls(update: (paused: boolean) => void): Controls {
	const active = useActive(() => update(paused.value));
	const paused = ref(false);
	return reactive({
		tick: () => update(false),
		active,
		paused,
	});
}
