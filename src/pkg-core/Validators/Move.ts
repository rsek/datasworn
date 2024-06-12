import type { Datasworn } from '../index.js'

export function validate<T extends Datasworn.Move>(obj: T) {
	// TODO: ensure stat and condition meter match up to player

	return true
}
