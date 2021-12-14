import { payloadError } from './errors';

import type { Action, State } from './types';

const ensureLimit = (limit: number | undefined, arr: any[]) => {
	if (!limit) return arr;

	let n = [...arr];

	if (n.length <= limit) return arr;

	const exceedsBy = n.length - limit;

	if (exceedsBy === 1) {
		n.shift();
	} else {
		n.splice(0, exceedsBy);
	}

	return n;
}

const mutate = (state: State, action: Action) => {
	const { past, present, future } = state;
	const { payload, behavior, historyLimit } = action;

	if (!payload) {
		payloadError('mutate');
	}

	let mPast = [...past];

	if (
		historyLimit !== 'infinium' &&
		historyLimit !== 'infinity'
	) {
		mPast = ensureLimit(historyLimit, past);
	}

	// We need to clone the array here because
	// calling `future.reverse()` will mutate the
	// existing array, causing the `mergePast` and
	// `mergePastReversed` behaviors to work the same
	// way.
	const futureClone = [...future];

	const behaviorMap = {
		mergePastReversed: {
			past: [...mPast, ...futureClone.reverse(), present],
			present: payload,
			future: []
		},
		mergePast: {
			past: [...mPast, ...future, present],
			present: payload,
			future: []
		},
		destroyFuture: {
			past: [...mPast, present],
			present: payload,
			future: []
		},
		keepFuture: {
			past: [...mPast, present],
			present: payload,
			future,
		}
	}	

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