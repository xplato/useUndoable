import type { Action, State } from './types';

const mutate = (state: State, action: Action, shouldKeepFuture: boolean) => {
	const { past, present, future } = state;

	const { newPresent } = action;

	if (JSON.stringify(newPresent) === JSON.stringify(present)) {
		// TODO:
		// Could this potentially cause component update issues
		// since we're returning the same state object? Would
		// some projects expect every call to mutate() to return
		// a new object, even if it has the same data?
		return state;
	}

	let newFuture: any[] = [];

	if (shouldKeepFuture) {
		// TODO:
		//
		// We may want to figure out a better
		// way to approach this. Instead of
		// keeping or erasing the current future,
		// we could, on setState events, reverse
		// the future and append it to the past.
		// Otherwise, the events would be removed
		// when the value is modified.
		newFuture = [...future];
	}

	return {
		past: [...past, present],
		present: newPresent,
		future: newFuture
	};
};

export {
	mutate,
}