import * as Const from './const.js'
import {
	Sep,
	CollectionTypeElement,
	TypeElement,
	type AnyId,
	type CollectableId,
	type CollectionId,
	type DictKey,
	type ExtractTypeElement,
	type NonCollectableId,
	type RulesPackageId
} from './const.js'
import {
	RECURSIVE_PATH_ELEMENTS_MAX,
	RECURSIVE_PATH_ELEMENTS_MIN
} from './const.js'
import { IdError } from './error.js'
import IdElementGuard from './IdElementGuard.js'
import TypeGuard from './TypeGuard.js'

/**
 * Parses a Datasworn ID into a data object.
 * @param id The ID to parse.
 * @throws If any of the ID elements are invalid.
 */
export function parseId<T extends AnyId>(id: T): ParsedId<T> {
	if (typeof id !== 'string') throw new IdError(id, `ID must be a string.`)

	let isWildcard = false

	let [rulesPackage, type, ...path] = id.split(Sep)

	// first element: RulesPackage identifier
	if (IdElementGuard.Wildcard(rulesPackage)) {
		isWildcard = true
	} else if (!TypeGuard.RulesPackageId(rulesPackage))
		throw new IdError(
			id,
			`"${String(
				rulesPackage as any
			)}" is not a valid Datasworn RulesPackage identifier.`
		)

	let subtype

	// if it's a collection ID, validate + assemble the subtype
	if (type === CollectionTypeElement) {
		subtype = path.shift()

		if (!IdElementGuard.CollectableTypeElement(subtype))
			throw new IdError(id, `"${subtype}" not a collectable type.`)
		type += Sep + subtype
	}

	if (!TypeElement.includes(type as TypeElement))
		throw new IdError(id, `parseId: "${type}" is not a valid Datasworn type.`)

	// The key for this object in its parent dictionary
	const key = path.pop() as DictKey

	let min, max: number
	let isRecursive: boolean

	switch (true) {
		case IdElementGuard.CollectionSubtypeElement(type): {
			// collections use what would otherwise be their last path element as a key -- offset the value
			isRecursive = IdElementGuard.RecursiveCollectableTypeElement(subtype)

			max = (isRecursive ? RECURSIVE_PATH_ELEMENTS_MAX : 1) - 1
			min = RECURSIVE_PATH_ELEMENTS_MIN - 1

			break
		}
		case IdElementGuard.RecursiveCollectableTypeElement(type): {
			// recursive collectables should have 1-3 path elements (plus a key)
			isRecursive = IdElementGuard.RecursiveCollectableTypeElement(type)

			max = isRecursive ? RECURSIVE_PATH_ELEMENTS_MAX : 1
			min = 1
			break
		}
		case IdElementGuard.NonRecursiveCollectableTypeElement(type): {
			// other collectables should have 1 path element (plus a key)
			isRecursive = false

			max = 1
			min = 1
			break
		}

		case IdElementGuard.NonCollectableTypeElement(type): {
			// non-collectable items should have 0 path elements (plus a key)
			isRecursive = false
			max = 0
			min = 0
			break
		}

		default:
			throw new IdError(id, `"${type}" is not a valid Datasworn type.`)
	}

	if (path.length > max || path.length < min)
		throw new IdError(
			id,
			`Expected ${min === max ? min : `${min}-${max}`} path elements, but got ${
				path.length
			}`
		)

	// Filter for invalid path elements
	const badElements = [...path, key].filter((el) => {
		if (isRecursive && IdElementGuard.RecursiveWildcard(el)) {
			isWildcard = true
			return false
		}
		if (IdElementGuard.Wildcard(el)) {
			isWildcard = true
			return false
		}
		if (IdElementGuard.DictKey(el)) return false
		return true
	})

	if (badElements.length > 0)
		throw new IdError(
			id,
			`Received invalid path elements: ${JSON.stringify(badElements)}`
		)

	// check the final element, which represents the key of the object
	if (IdElementGuard.Wildcard(key)) {
		isWildcard = true
	} else if (!IdElementGuard.DictKey(key))
		throw new Error(
			`"${String(key as any)}" is not a valid Datasworn dictionary key.`
		)

	// if (!IdElementGuard.RecursiveCollectionSubtypeElement(type) && ) {

	// }

	const parsed = {
		id,
		rulesPackage,
		type,
		path,
		key,
		isWildcard
	} as ParsedId<T>

	return parsed
}
export type ParsedId<T extends AnyId = AnyId> = T extends CollectionId
	? ParsedCollectionId<T>
	: T extends CollectableId
	  ? ParsedCollectableId<T>
	  : T extends NonCollectableId
	    ? ParsedNonCollectableId<T>
	    : ParsedAnyId

interface ParsedAnyId<T extends AnyId = AnyId> {
	/** The original ID. */
	id: T
	/** The ID of the RulesPackage that contains this ID. */
	rulesPackage: RulesPackageId
	/** The type of object that this ID belongs to. */
	type: ExtractTypeElement<T>
	/** Path elements indicating the item's parent Collection, if any. */
	path: DictKey[]
	/** The key of the item in its parent Dictionary. */
	key: DictKey
	isWildcard: boolean
}
interface ParsedCollectionId<T extends CollectionId> extends ParsedAnyId<T> {
	path: [] | [DictKey] | [DictKey, DictKey]
}
interface ParsedCollectableId<T extends CollectableId> extends ParsedAnyId<T> {
	path: [DictKey] | [DictKey, DictKey] | [DictKey, DictKey, DictKey]
}
interface ParsedNonCollectableId<T extends NonCollectableId>
	extends ParsedAnyId<T> {
	path: []
}

export function extractSubtype<T extends Const.CollectionSubtypeElement>(
	str: T
) {
	const [_, subtype] = str.split(Const.Sep) as [
		Const.CollectionTypeElement,
		T extends Const.CollectionSubtypeElement<infer U> ? U : never
	]

	return subtype
}
