import { mutate } from './mutate';
import { payloadError } from './errors';

import type { Action, State } from './types';

const reducer = (state: State, action: Action): State => {
	const { past, present, future } = state;

	const undo = () => {
		if (past.length === 0) {
			return state;
		}

		const previous = past[past.length - 1];
		const newPast = past.slice(0, past.length - 1);

		return {
			past: newPast,
			present: previous,
			future: [present, ...future]
		};
	}

	const redo = () => {
		if (future.length === 0) {
			return state;
		}

		const next = future[0];
		const newFuture = future.slice(1);

		return {
			past: [...past, present],
			present: next,
			future: newFuture
		}
	}

	const update = () => mutate(state, action);

	const reset = () => {
		const { payload } = action;

		return {
			past: [],
			present: payload,
			future: []
		};
	};

	const resetInitialState = () => {
		const { payload } = action;

		if (!payload) {
			payloadError('resetInitialState');
		}

		// Duplicate the past for mutation
		let mPast = [...past];
		mPast[0] = payload;

		return {
			past: [...mPast],
			present,
			future: [...future]
		};
	}

	const actions = {
		undo,
		redo,
		update,
		reset,
		resetInitialState
	}

	return actions[action.type]();
};

export {
	reducer
}