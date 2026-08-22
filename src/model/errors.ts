export function InvalidDurationError(duration?: number | undefined | null) {
	return new Error("Invalid Duration");
}