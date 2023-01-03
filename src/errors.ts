export const payloadError = (func: string) => {
	throw new Error(`NoPayloadError: ${func} requires a payload.`)
}

export const invalidBehavior = (behavior: string) => {
	throw new Error(
		`Mutation behavior must be one of: mergePastReversed, mergePast, keepFuture, or destroyFuture. Not: ${behavior}`
	)
}
