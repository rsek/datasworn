/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */

import * as Patterns from './RegEx.js'
import * as CONST from './const.js'
import * as TypeElements from './TypeElements.js'
import type * as Id from '../StringTemplateLiterals.js'

export function DictKey(value: unknown): value is Id.DictKey {
	return typeof value === 'string' && Patterns.DictKey.test(value)
}

export function RulesPackageId(value: unknown): value is Id.RulesPackageId {
	return typeof value === 'string' && Patterns.RulesPackageId.test(value)
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

export function CollectionType(
	value: unknown
): value is TypeElements.Collection {
	return value === TypeElements.Collection
}

export function NonCollectableType(
	value: unknown
): value is TypeElements.NonCollectable {
	return TypeElements.NonCollectable.includes(
		value as TypeElements.NonCollectable
	)
}

export function CollectionSubtype(
	typeTuple: unknown[]
): typeTuple is [TypeElements.Collection, TypeElements.Collectable.Any] {
	const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2
	if (!isTuple) return false
	const [collectionType, subtype] = typeTuple
	return CollectionType(collectionType) && CollectableType(subtype)
}

export function RecursiveCollectionSubtype(
	typeTuple: unknown[]
): typeTuple is [TypeElements.Collection, TypeElements.Collectable.Recursive] {
	const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2
	if (!isTuple) return false
	const [collectionType, subtype] = typeTuple
	return CollectionType(collectionType) && RecursiveCollectableType(subtype)
}

export function NonRecursiveCollectionSubtype(
	typeTuple: unknown[]
): typeTuple is [
	TypeElements.Collection,
	TypeElements.Collectable.NonRecursive
] {
	const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2
	if (!isTuple) return false
	const [collectionType, subtype] = typeTuple
	return CollectionType(collectionType) && NonRecursiveCollectableType(subtype)
}

export function CollectableType(
	value: unknown
): value is TypeElements.Collectable.Any {
	return TypeElements.Collectable.Any.includes(
		value as TypeElements.Collectable.Any
	)
}

export function AnyType(
	value: unknown
): value is
	| TypeElements.NonCollectable
	| TypeElements.Collectable.Any
	| TypeElements.Collection {
	return (
		NonCollectableType(value) || CollectableType(value) || CollectionType(value)
	)
}

export function RecursiveCollectableType(
	value: unknown
): value is TypeElements.Collectable.Recursive {
	return TypeElements.Collectable.Recursive.includes(
		value as TypeElements.Collectable.Recursive
	)
}
export function NonRecursiveCollectableType(
	value: unknown
): value is TypeElements.Collectable.NonRecursive {
	return TypeElements.Collectable.NonRecursive.includes(
		value as TypeElements.Collectable.NonRecursive
	)
}
