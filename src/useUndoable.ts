import { useReducer, useCallback } from 'react';

import { reducer } from './reducer';

const initialState = {
	past: [],
	present: null,
	future: [],
};

const useUndoable = (initialPresent: any) => {
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

	const set = useCallback(newPresent => dispatch({ type: 'set', newPresent }), []);
	const update = useCallback(newPresent => dispatch({ type: 'update', newPresent }), []);
	const reset = useCallback((newPresent = initialPresent) => dispatch({ type: 'reset', newPresent }), []);

	return [
		state.present,
		update,
		{
			past: state.past,
			future: state.future,

			set,
			reset,
			undo,
			canUndo,
			redo,
			canRedo
		}
	];
}

export default useUndoable;
