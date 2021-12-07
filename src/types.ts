type ActionType = 'undo' | 'redo' | 'set' | 'update' | 'reset';

interface Action {
	type: ActionType;
	newPresent?: any;
}

interface State {
	past: any[];
	present: any;
	future: any[];
}

export type {
	ActionType,
	Action,
	State
}