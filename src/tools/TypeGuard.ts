import Patterns from './Patterns.js'
import { type RulesPackageId, type CollectionId } from './const.js'

namespace TypeGuard {
	export function RulesPackageId(value: unknown): value is RulesPackageId {
		return typeof value === 'string' && Patterns.RulesPackageId.test(value)
	}

	export function CollectionId(value: unknown): value is CollectionId {}
}

export default TypeGuard
