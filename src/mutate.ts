import { payloadError, invalidBehavior } from "./errors"

import type { Action, State } from "./types"

const ensureLimit = (limit: number | undefined, arr: any[]) => {
	// Ensures that the `past` array doesn't exceed
	// the specified `limit` amount. This is referred
	// to as the `historyLimit` within the public API.

	// The conditional check in the `mutate` function
	// might pass a potentially `undefined` value,
	// therefore we check if it's valid here.
	if (!limit) return arr

	let n = [...arr]

	if (n.length <= limit) return arr

	const exceedsBy = n.length - limit

	if (exceedsBy === 1) {
		// This isn't faster than splice, but it works;
		// therefore, we're leaving it.
		// https://www.measurethat.net/Benchmarks/Show/3454/0/slice-vs-splice-vs-shift-who-is-the-fastest-to-keep-con
		n.shift()
	} else {
		// This shouldn't ever happen, I think.
		n.splice(0, exceedsBy)
	}

	return n
}

const mutate = (state: State, action: Action) => {
	const { past, present, future } = state
	const {
		payload,
		behavior,
		historyLimit,
		ignoreIdenticalMutations,
		cloneState,
		ignoreAction,
	} = action

	if (!payload && payload !== '' && payload !== 0) {
		// A mutation call requires a payload.
		// I guess we _could_ simply set the state
		// to `undefined` with an empty payload,
		// but this would probably be considered
		// unexpected behavior.
		//
		// If you want to set the state to `undefined`,
		// pass that explicitly.
		payloadError("mutate")
	}

	if (ignoreAction) {
		return {
			past,
			present: payload,
			future,
		}
	}

	let mPast = [...past]

	if (historyLimit !== "infinium" && historyLimit !== "infinity") {
		mPast = ensureLimit(historyLimit, past)
	}

	const isEqual = JSON.stringify(payload) === JSON.stringify(present)

	if (ignoreIdenticalMutations && isEqual) {
		return cloneState ? { ...state } : state
	}

	// We need to clone the array here because
	// calling `future.reverse()` will mutate the
	// existing array, causing the `mergePast` and
	// `mergePastReversed` behaviors to work the same
	// way.
	const futureClone = [...future]

	const behaviorMap = {
		mergePastReversed: {
			past: [...mPast, ...futureClone.reverse(), present],
			present: payload,
			future: [],
		},
		mergePast: {
			past: [...mPast, ...future, present],
			present: payload,
			future: [],
		},
		destroyFuture: {
			past: [...mPast, present],
			present: payload,
			future: [],
		},
		keepFuture: {
			past: [...mPast, present],
			present: payload,
			future,
		},
	}

	// Defaults should handle this case; mostly to make TS happy
	if (typeof behavior === "undefined") {
		return behaviorMap.mergePastReversed
	}

	if (!behaviorMap.hasOwnProperty(behavior)) invalidBehavior(behavior)
	return behaviorMap[behavior]
}

export { mutate }
