import type * as Datasworn from '../Datasworn.js'
import * as DiceRange from './DiceRange.js'

export function validate<T extends Datasworn.OracleRollableRow>(object: T) {
	DiceRange.validate(object.roll)

	return true
}
