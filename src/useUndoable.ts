import { useReducer, useCallback } from 'react';

import { reducer } from './reducer';

import type { MutationBehavior, Options } from './types';

const initialState = {
	past: [],
	present: null,
	future: [],
};

const defaultOptions: Options = {
	behavior: 'mergePastReversed',
	historyLimit: 100
}

const useUndoable = (initialPresent: any, options: Options = defaultOptions) => {
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		present: initialPresent
	});

	const canUndo = state.past.length !== 0;
	const canRedo = state.future.length !== 0;

	const undo = useCallback(() => {
		if (canUndo) {
			dispatch({ type: 'undo' });
		}
	}, [canUndo]);

	const redo = useCallback(() => {
		if (canRedo) {
			dispatch({ type: 'redo' });
		}
	}, [canRedo]);

	const reset = useCallback((payload = initialPresent) => dispatch({ type: 'reset', payload }), []);
	const resetInitialState = useCallback(payload => dispatch({ type: 'resetInitialState', payload }), []);

	const update = useCallback((payload, mutationBehavior: MutationBehavior) =>
		dispatch({
			type: 'update', 
			payload, 
			behavior: mutationBehavior,
			historyLimit: options.historyLimit || defaultOptions.historyLimit
		}), []);


	// We can ignore the undefined type error here because
	// we are setting a default value to options.
	//
	// @ts-ignore
	const setState = (payload: any, mutationBehavior: MutationBehavior = options.behavior) => {
		return typeof payload === 'function' ? (
			update(payload(state.present), mutationBehavior)
		) : (
			update(payload, mutationBehavior)
		);
	}

	return [
		state.present,
		setState,
		{
			past: state.past,
			future: state.future,

			undo,
			canUndo,
			redo,
			canRedo,

			reset,
			resetInitialState
		}
	];
}

export default useUndoable;
