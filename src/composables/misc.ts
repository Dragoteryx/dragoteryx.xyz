import { computed, toValue, reactive, ref, type ComputedRef, type MaybeRefOrGetter, type WritableComputedRef } from "vue";
import { useIntervalFn } from "@vueuse/core";

export interface Controls {
	active: boolean;
	paused: boolean;
	tick(): void;
}

export function useActive(update: () => void): WritableComputedRef<boolean> {
	const controls = useIntervalFn(update, 1000/60);
	return computed({
		get: () => controls.isActive.value,
		set(value) {
			if (value) controls.resume();
			else controls.pause();
		}
	});
}

export function useControls(update: (paused: boolean) => void): Controls {
	const paused = ref(false);
	return reactive({
		tick: () => update(false),
		active: useActive(() => update(paused.value)),
		paused,
	});
}

export function useFibonacci(n: MaybeRefOrGetter<number>): ComputedRef<number> {
	return computed(() => {
		const m = toValue(n);
		if (m < 2) {
			return m;
		} else {
			let a = 0;
			let b = 1;
			for (let i = 1; i < m; ++i) {
				let c = a + b;
				a = b;
				b = c;
			}
			return b;
		}
	});
}