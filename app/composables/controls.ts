import { skipHydrate } from "pinia";

export interface Controls {
	active: boolean;
	paused: boolean;
	tick(): void;
}

export function useActive(tickrate: MaybeRefOrGetter<number>, update: () => void): WritableComputedRef<boolean> {
	const interval = computed(() => 1000 / toValue(tickrate));
	const controls = useIntervalFn(update, interval);
	return skipHydrate(
		computed({
			get: () => controls.isActive.value,
			set(value) {
				if (value) controls.resume();
				else controls.pause();
			},
		}),
	);
}

export function useControls(tickrate: MaybeRefOrGetter<number>, update: (paused: boolean) => void): Controls {
	const active = useActive(tickrate, () => update(paused.value));
	const paused = ref(false);
	return skipHydrate(
		reactive({
			tick: () => update(false),
			active,
			paused,
		}),
	);
}
