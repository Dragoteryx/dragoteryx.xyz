import {
	computed,
	type ComputedRef,
	type MaybeRefOrGetter,
	toValue,
} from "vue";

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
