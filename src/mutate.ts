import type { Action, State } from './types';

const mutate = (state: State, action: Action) => {
	const { past, present, future } = state;

	const { payload, behavior } = action;

	if (JSON.stringify(payload) === JSON.stringify(present)) {
		// TODO:
		// Could this potentially cause component update issues
		// since we're returning the same state object? Would
		// some projects expect every call to mutate() to return
		// a new object, even if it has the same data?
		return state;
	}

	// We need to clone the array here because
	// calling `future.reverse()` will mutate the
	// existing array, causing the `mergePast` and
	// `mergePastReversed` behaviors to work the same
	// way.
	const futureClone = [...future];

	const behaviorMap = {
		mergePastReversed: {
			past: [...past, ...futureClone.reverse(), present],
			present: payload,
			future: []
		},
		mergePast: {
			past: [...past, ...future, present],
			present: payload,
			future: []
		},
		destroyFuture: {
			past: [...past, present],
			present: payload,
			future: []
		},
		keepFuture: {
			past: [...past, present],
			present: payload,
			future,
		}
	}

	console.log({future});
	

	// We're ignoring this index error here
	// because the `behavior` key is possibly
	// undefined within the Action type. Of course,
	// since the `setState` function in the `useUndoable.ts`
	// file sets a default value for this parameter, we know
	// it'll always be defined.
	//
	// It was left potentially undefined within the Action
	// type so that all calls to `dispatch` don't need to
	// specify the behavior.
	//
	// @ts-ignore
	return behaviorMap[behavior]
};

export {
	mutate,
}