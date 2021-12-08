const payloadError = (func: string) => {
	throw new Error(`NoPayloadError: ${func} requires a payload.`);
};

export {
	payloadError
}