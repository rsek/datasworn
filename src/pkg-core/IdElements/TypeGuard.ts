/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */

import Pattern from './Pattern.js'
import CONST from './CONST.js'
import type * as Id from '../StringId.js'
import type { DictKey } from '../Datasworn.js'
import NodeTypeId from './NodeTypeId.js'

namespace TypeGuard {
	export function DictKey(value: unknown): value is DictKey {
		return typeof value === 'string' && Pattern.DictKey.test(value)
	}

	export function RulesPackageId(value: unknown): value is Id.RulesPackageId {
		return typeof value === 'string' && Pattern.RulesPackageId.test(value)
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
	): value is NodeTypeId.Collection.Recursive {
		for (const v of NodeTypeId.Collection.Recursive)
			if (v === value) return true

		return false
	}

	export function NonRecursiveCollectionType(
		value: unknown
	): value is NodeTypeId.Collection.NonRecursive {
		for (const v of NodeTypeId.Collection.NonRecursive)
			if (v === value) return true

		return false
	}

	export function CollectionType(
		value: unknown
	): value is NodeTypeId.Collection.Any {
		return RecursiveCollectionType(value) || NonRecursiveCollectionType(value)
	}

	export function NonCollectableType(
		value: unknown
	): value is NodeTypeId.NonCollectable {
		for (const v of NodeTypeId.NonCollectable) if (v === value) return true

		return false
	}

	export function RecursiveCollectableType(
		value: unknown
	): value is NodeTypeId.Collectable.Recursive {
		for (const v of NodeTypeId.Collectable.Recursive)
			if (v === value) return true

		return false
	}

	export function NonRecursiveCollectableType(
		value: unknown
	): value is NodeTypeId.Collectable.NonRecursive {
		for (const v of NodeTypeId.Collectable.NonRecursive)
			if (v === value) return true

		return false
	}

	export function CollectableType(
		value: unknown
	): value is NodeTypeId.Collectable.Any {
		return RecursiveCollectableType(value) || NonRecursiveCollectableType(value)
	}

	export function AnyType(
		value: unknown
	): value is
		| NodeTypeId.NonCollectable
		| NodeTypeId.Collectable.Any
		| NodeTypeId.Collection.Any {
		return (
			NonCollectableType(value) ||
			CollectableType(value) ||
			CollectionType(value)
		)
	}
}

export default TypeGuard
