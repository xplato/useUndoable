type ActionType = 'undo' | 'redo' | 'set' | 'update' | 'reset';

type MutationBehavior = 'mergePast' | 'destroyFuture' | 'keep future';

interface Action {
	type: ActionType;
	payload?: any;
	behavior?: MutationBehavior
}

interface State {
	past: any[];
	present: any;
	future: any[];
}

export type {
	ActionType,
	MutationBehavior,
	Action,
	State
}