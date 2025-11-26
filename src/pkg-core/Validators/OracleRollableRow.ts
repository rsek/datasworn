import type * as Datasworn from '../Datasworn.js'
import * as DiceRange from './DiceRange.js'

export function validate<T extends Datasworn.OracleRollableRow>(object: T) {
	if (object.roll != null) DiceRange.validate(object.roll)

	return true
}
