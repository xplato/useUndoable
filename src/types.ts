export type ActionType =
	| "undo"
	| "redo"
	| "update"
	| "reset"
	| "resetInitialState"

export type HistoryLimit = number | "infinium" | "infinity"

export type MutationBehavior =
	| "mergePastReversed"
	| "mergePast"
	| "destroyFuture"
	| "keepFuture"

export interface Action<T> {
	type: ActionType
	payload?: T
	behavior?: MutationBehavior
	historyLimit?: HistoryLimit
	ignoreIdenticalMutations?: boolean
	cloneState?: boolean
	ignoreAction?: boolean
}

export interface State<T> {
	past: T[]
	present: T
	future: T[]
}

export interface Options {
	behavior?: MutationBehavior
	historyLimit?: HistoryLimit
	ignoreIdenticalMutations?: boolean
	cloneState?: boolean
}

export type UseUndoable<T> = [
	T,
	(
		payload: T | ((oldValue: T) => T),
		behavior?: MutationBehavior,
		ignoreAction?: boolean
	) => void,
	{
		past: T[]
		future: T[]

		undo: () => void
		canUndo: boolean
		redo: () => void
		canRedo: boolean

		reset: (initialState?: T) => void
		resetInitialState: (newInitialState: T) => void
		static_setState: (
			payload: T,
			behavior?: MutationBehavior,
			ignoreAction?: boolean
		) => void
	}
]
