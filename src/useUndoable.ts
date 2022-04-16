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
	historyLimit: 100,
	ignoreIdenticalMutations: true,
	cloneState: false,
}

const compileMutateOptions = (options: Options) => ({
	...defaultOptions,
	...options
});

const useUndoable = <T = any>(initialPresent: T, options: Options = defaultOptions): [
	T,
	(payload: T | ((oldValue: T) => T) , behavior?: MutationBehavior) => void,
 	{
		past: T[]
		future: T[]
		undo: () => void
		canUndo: boolean
		redo: () => void
		canRedo: boolean
		reset: (initialState?: T) => void
    	resetInitialState: (newInitialState: T) => void
		static_setState: (payload: T | ((oldValue: T) => T) , behavior?: MutationBehavior) => void,
	}
] => {
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
			...compileMutateOptions(options)
		}), []);


	// We can ignore the undefined type error here because
	// we are setting a default value to options.
	//
	// @ts-ignore
	const setState = useCallback((payload: any, mutationBehavior: MutationBehavior = options.behavior) => {
		return typeof payload === 'function' ? (
			update(payload(state.present), mutationBehavior)
		) : (
			update(payload, mutationBehavior)
		);
	}, [state]);

	// In some rare cases, the fact that the above setState
	// function changes on every render can be problematic.
	// Since we can't really avoid this (setState uses
	// state.present), we must export another function that
	// doesn't depend on the present state (and thus doesn't
	// need to change).
	//
	// Wrapping it in useCallback isn't really necessary,
	// but it's consistent with everything else.
	//
	// We ignore this for the same reason as in the setState
	// function.
	//
	// @ts-ignore
	const static_setState = useCallback((payload: any, mutationBehavior: MutationBehavior = options.behavior) => {
		update(payload, mutationBehavior);
	}, []);

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
			resetInitialState,
			static_setState,
		}
	];
}

export default useUndoable;
