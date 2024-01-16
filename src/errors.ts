export const payloadError = (func: string) => {
	return new Error(`NoPayloadError: ${func} requires a payload.`)
}

export const invalidBehaviorError = (behavior: string) => {
	return new Error(
		`Mutation behavior must be one of: mergePastReversed, mergePast, keepFuture, or destroyFuture. Not: ${behavior}`
	)
}
