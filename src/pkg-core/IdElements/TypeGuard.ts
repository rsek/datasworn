/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */

import Regex from './Regex.js'
import CONST from './CONST.js'
import TypeId from './TypeId.js'
import type * as Id from '../Id/StringId.js'
import type { DictKey } from '../Datasworn.js'

namespace TypeGuard {
	export function DictKey(value: unknown): value is DictKey {
		return typeof value === 'string' && Regex.DictKey.test(value)
	}

	export function RulesPackageId(value: unknown): value is Id.RulesPackageId {
		return typeof value === 'string' && Regex.RulesPackageId.test(value)
	}

	export function Wildcard(value: unknown): value is CONST.WildcardString {
		return value === CONST.WildcardString
	}

	export function Globstar(value: unknown): value is CONST.GlobstarString {
		return value === CONST.GlobstarString
	}

	export function AnyWildcard(
		value: unknown
	): value is CONST.WildcardString | CONST.GlobstarString {
		return Wildcard(value) || Globstar(value)
	}

	export function RecursiveCollectionType(
		value: unknown
	): value is TypeId.Collection.Recursive {
		for (const v of TypeId.Collection.Recursive) if (v === value) return true

		return false
	}

	export function NonRecursiveCollectionType(
		value: unknown
	): value is TypeId.Collection.NonRecursive {
		for (const v of TypeId.Collection.NonRecursive) if (v === value) return true

		return false
	}

	export function CollectionType(
		value: unknown
	): value is TypeId.Collection.Any {
		return RecursiveCollectionType(value) || NonRecursiveCollectionType(value)
	}

	export function NonCollectableType(value: unknown): value is TypeId.NonCollectable {
		for (const v of TypeId.NonCollectable) if (v === value) return true

		return false
	}

	export function RecursiveCollectableType(
		value: unknown
	): value is TypeId.Collectable.Recursive {
		for (const v of TypeId.Collectable.Recursive) if (v === value) return true

		return false
	}

	export function NonRecursiveCollectableType(
		value: unknown
	): value is TypeId.Collectable.NonRecursive {
		for (const v of TypeId.Collectable.NonRecursive)
			if (v === value) return true

		return false
	}

	export function CollectableType(
		value: unknown
	): value is TypeId.Collectable.Any {
		return RecursiveCollectableType(value) || NonRecursiveCollectableType(value)
	}

	export function AnyType(
		value: unknown
	): value is
		| TypeId.NonCollectable
		| TypeId.Collectable.Any
		| TypeId.Collection.Any {
		return (
			NonCollectableType(value) ||
			CollectableType(value) ||
			CollectionType(value)
		)
	}
}

export default TypeGuard
