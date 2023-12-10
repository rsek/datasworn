/** Errors for Datasworn IDs */
export class IdError extends Error {
	constructor(id: string, message: string) {
		super(`Unable to parse Datasworn ID "${id}": ${message}`)
	}
}
