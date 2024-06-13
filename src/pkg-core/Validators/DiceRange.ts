import type { Datasworn } from '../index.js'

export function validate<T extends Datasworn.DiceRange>(obj: T) {
	if (obj.max < obj.min)
		throw new Error(
			`DiceRange min (${obj.min}) is greater than max (${obj.max})`
		)

	return true
}
