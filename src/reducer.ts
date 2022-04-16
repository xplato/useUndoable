import { MutableRefObject } from 'react';
import { mutate } from './mutate';
import { payloadError } from './errors';

import type { Action, State } from './types';


const reducer = (stateRef: MutableRefObject<State>) => (state: State, action: Action): State => {
	const { past, present, future } = state;

	const undo = () => {
		if (past.length === 0) {
			return state;
		}

		const previous = past[past.length - 1];
		const newPast = past.slice(0, past.length - 1);

		const newState = {
			past: newPast,
			present: previous,
			future: [present, ...future]
		};

		stateRef.current = newState;
		return newState;
	}

	const redo = () => {
		if (future.length === 0) {
			return state;
		}

		const next = future[0];
		const newFuture = future.slice(1);

		const newState = {
			past: [...past, present],
			present: next,
			future: newFuture
		}

		stateRef.current = newState;
		return newState;
	}

	const update = () => {
		const newState = mutate(state, action);
		stateRef.current = newState;
		return newState;
	};

	const reset = () => {
		const { payload } = action;

		const newState = {
			past: [],
			present: payload,
			future: []
		};

		stateRef.current = newState;
		return newState;
	};

	const resetInitialState = () => {
		const { payload } = action;

		if (!payload) {
			payloadError('resetInitialState');
		}

		// Duplicate the past for mutation
		let mPast = [...past];
		mPast[0] = payload;

		const newState = {
			past: [...mPast],
			present,
			future: [...future]
		};

		stateRef.current = newState;
		return newState;
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
