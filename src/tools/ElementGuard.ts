import Patterns from './Patterns.js'
import * as Const from './const.js'
import type * as Types from './types.js'

/** Type guards for ID elements. */
namespace ElementGuard {
	export function DictKey(value: unknown): value is Types.DictKey {
		return typeof value === 'string' && Patterns.DictKey.test(value)
	}

	export function RulesPackage(value: unknown): value is Types.RulesPackageId {
		return typeof value === 'string' && Patterns.RulesPackageId.test(value)
	}

	export function Wildcard(value: unknown): value is Const.Wildcard {
		return value === Const.Wildcard
	}

	export function Globstar(value: unknown): value is Const.Globstar {
		return value === Const.Globstar
	}

	export function AnyWildcard(
		value: unknown
	): value is Const.Wildcard | Const.Globstar {
		return Wildcard(value) || Globstar(value)
	}

	export function CollectionType(
		value: unknown
	): value is Const.CollectionTypeElement {
		return value === Const.CollectionTypeElement
	}

	export function NonCollectableType(
		value: unknown
	): value is Const.NonCollectableTypeElement {
		return Const.NonCollectableTypeElement.includes(
			value as Const.NonCollectableTypeElement
		)
	}

	export function CollectionSubtype(
		typeTuple: unknown[]
	): typeTuple is [Const.CollectionTypeElement, Const.CollectableTypeElement] {
		const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2
		if (!isTuple) return false
		const [collectionType, subtype] = typeTuple
		return CollectionType(collectionType) && CollectableType(subtype)
	}

	export function RecursiveCollectionSubtype(
		typeTuple: unknown[]
	): typeTuple is [
		Const.CollectionTypeElement,
		Const.RecursiveCollectableTypeElement
	] {
		const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2
		if (!isTuple) return false
		const [collectionType, subtype] = typeTuple
		return CollectionType(collectionType) && RecursiveCollectableType(subtype)
	}

	export function NonRecursiveCollectionSubtype(
		typeTuple: unknown[]
	): typeTuple is [
		Const.CollectionTypeElement,
		Const.NonRecursiveCollectableTypeElement
	] {
		const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2
		if (!isTuple) return false
		const [collectionType, subtype] = typeTuple
		return (
			CollectionType(collectionType) && NonRecursiveCollectableType(subtype)
		)
	}

	export function CollectableType(
		value: unknown
	): value is Const.CollectableTypeElement {
		return Const.CollectableTypeElement.includes(
			value as Const.CollectableTypeElement
		)
	}

	export function AnyType(
		value: unknown
	): value is
		| Const.NonCollectableTypeElement
		| Const.CollectableTypeElement
		| Const.CollectionTypeElement {
		return (
			NonCollectableType(value) ||
			CollectableType(value) ||
			CollectionType(value)
		)
	}

	export function RecursiveCollectableType(
		value: unknown
	): value is Const.RecursiveCollectableTypeElement {
		return Const.RecursiveCollectableTypeElement.includes(
			value as Const.RecursiveCollectableTypeElement
		)
	}
	export function NonRecursiveCollectableType(
		value: unknown
	): value is Const.NonRecursiveCollectableTypeElement {
		return Const.NonRecursiveCollectableTypeElement.includes(
			value as Const.NonRecursiveCollectableTypeElement
		)
	}
}
export default ElementGuard
