type ActionType = 'undo' | 'redo' | 'set' | 'update' | 'reset';
type HistoryLimit = number | 'infinium' | 'infinity';

type MutationBehavior =
	'mergePastReversed' |
	'mergePast' |
	'destroyFuture' |
	'keep future';

interface Action {
	type: ActionType;
	payload?: any;
	behavior?: MutationBehavior;
	historyLimit?: HistoryLimit;
}

interface State {
	past: any[];
	present: any;
	future: any[];
}

interface Options {
	behavior?: MutationBehavior,
	historyLimit?: HistoryLimit;
}

export type {
	ActionType,
	HistoryLimit,
	MutationBehavior,
	Action,
	State,
	Options
}