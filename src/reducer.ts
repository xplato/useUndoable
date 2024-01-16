import { mutate } from "./mutate"
import { payloadError } from "./errors"

import type { Action, State } from "./types"

export const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
	const { past, present, future } = state

	const undo = (): State<T> => {
		if (past.length === 0) {
			return state
		}

		const previous = past[past.length - 1]
		const newPast = past.slice(0, past.length - 1)

		return {
			past: newPast,
			present: previous,
			future: [present, ...future],
		}
	}

	const redo = (): State<T> => {
		if (future.length === 0) {
			return state
		}

		const next = future[0]
		const newFuture = future.slice(1)

		return {
			past: [...past, present],
			present: next,
			future: newFuture,
		}
	}

	// Transform functional updater to raw value by applying it
	const transform = (action: Action<T>) => {
		action.payload = typeof action.payload === "function"
			? action.payload(present)
			: action.payload

		return action
	}

	const update = (): State<T> => mutate(state, transform(action))

	const reset = (): State<T> => {
		const { payload } = action

		return {
			past: [],
			present: payload || state.present,
			future: [],
		}
	}

	const resetInitialState = (): State<T> => {
		const { payload } = action

		if (!payload) {
			throw payloadError("resetInitialState")
		}

		// Duplicate the past for mutation
		let mPast = [...past]
		mPast[0] = payload

		return {
			past: [...mPast],
			present,
			future: [...future],
		}
	}

	const actions = {
		undo,
		redo,
		update,
		reset,
		resetInitialState,
	}

	return actions[action.type]()
}
