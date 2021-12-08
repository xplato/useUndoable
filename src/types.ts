type ActionType = 'undo' | 'redo' | 'update' | 'reset' | 'resetInitialState';
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
	HistoryLimit,
	MutationBehavior,
	Action,
	State,
	Options
}