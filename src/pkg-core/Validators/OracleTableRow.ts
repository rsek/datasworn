import type * as Datasworn from '../Datasworn.js'
import * as DiceRange from './DiceRange.js'

export function validate<T extends Datasworn.OracleTableRow>(object: T) {
	DiceRange.validate(object.roll)

	return true
}
