/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */

import Regex from './Regex.js'
import CONST from './CONST.js'
import TypeElements from './TypeElements.js'
import type * as Id from '../Id/Strings.js'
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
	): value is TypeElements.Collection.Recursive {
		for (const k in TypeElements.Collection.Recursive)
			if (TypeElements.Collection.Recursive[k] === value) return true

		return false
	}

	export function NonRecursiveCollectionType(
		value: unknown
	): value is TypeElements.Collection.NonRecursive {
		for (const k in TypeElements.Collection.NonRecursive)
			if (TypeElements.Collection.NonRecursive[k] === value) return true

		return false
	}

	export function CollectionType(
		value: unknown
	): value is TypeElements.Collection.Any {
		return RecursiveCollectionType(value) || NonRecursiveCollectionType(value)
	}

	export function NonCollectableType(
		value: unknown
	): value is TypeElements.NonCollectable {
		for (const k in TypeElements.NonCollectable)
			if (TypeElements.NonCollectable[k] === value) return true

		return false
	}

	export function RecursiveCollectableType(
		value: unknown
	): value is TypeElements.Collectable.Recursive {
		for (const k in TypeElements.Collectable.Recursive)
			if (TypeElements.Collectable.Recursive[k] === value) return true

		return false
	}

	export function NonRecursiveCollectableType(
		value: unknown
	): value is TypeElements.Collectable.NonRecursive {
		for (const k in TypeElements.Collectable.NonRecursive)
			if (TypeElements.Collectable.NonRecursive[k] === value) return true

		return false
	}

	export function CollectableType(
		value: unknown
	): value is TypeElements.Collectable.Any {
		return RecursiveCollectableType(value) || NonRecursiveCollectableType(value)
	}

	export function AnyType(
		value: unknown
	): value is
		| TypeElements.NonCollectable
		| TypeElements.Collectable.Any
		| TypeElements.Collection.Any {
		return (
			NonCollectableType(value) ||
			CollectableType(value) ||
			CollectionType(value)
		)
	}
}

export default TypeGuard
