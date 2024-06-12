import type { Datasworn } from '../index.js'

export function validate<T extends Datasworn.Asset>(obj: T) {
	// TODO: ensure asset ability enhances point to valid controls

	return true
}
