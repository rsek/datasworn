/** Error thrown when parsing Datasworn IDs */
export class ParseError extends Error {
	constructor(id: string, message: string) {
		super(`Unable to parse ID <${id}>! ${message}`)
	}
}
