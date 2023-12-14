import * as Const from './const.js'
import {
	Sep,
	CollectionTypeElement,
	TypeElement,
	RECURSIVE_PATH_ELEMENTS_MAX,
	RECURSIVE_PATH_ELEMENTS_MIN
} from './const.js'
import {
	type RootKeyForTypeElement,
	type AnyId,
	type DictKey,
	type NonCollectableId,
	type RulesPackageId,
	type ExtractTypeElements,
	type RecursiveCollectableId,
	type NonRecursiveCollectableId,
	type RecursiveCollectionId,
	type NonRecursiveCollectionId,
	type ExtractCollectedTypeElement,
	type CollectionId
} from './types.js'
import { IdError } from './error.js'
import ElementGuard from './ElementGuard.js'
import TypeGuard from './TypeGuard.js'

/**
 * Parses a Datasworn ID into a data object.
 * @param id The ID to parse.
 * @throws If any of the ID elements are invalid.
 */
export function parseId<T extends AnyId>(id: T): ParsedId<T> {
	if (typeof id !== 'string') throw new IdError(id, `ID must be a string.`)

	let wildcard = false

	const [rulesPackage, typeElement, ...collectionKeys] = id.split(Sep)

	const typeElements = [typeElement]

	// first element: RulesPackage identifier
	if (ElementGuard.Wildcard(rulesPackage)) {
		wildcard = true
	} else if (!TypeGuard.RulesPackageId(rulesPackage))
		throw new IdError(
			id,
			`"${String(
				rulesPackage as any
			)}" is not a valid Datasworn RulesPackage identifier.`
		)

	// if it's a collection type, move the subtype element from collectionKeys to typeElements
	if (typeElement === CollectionTypeElement) {
		const subtype = collectionKeys.shift()

		if (!ElementGuard.CollectableTypeElement(subtype))
			throw new IdError(id, `"${subtype}" not a collectable type.`)
		typeElements.push(subtype)
	}

	// The key for this object in its parent dictionary
	const key = collectionKeys.pop() as DictKey

	let min, max: number
	let recursive: boolean

	switch (true) {
		case ElementGuard.CollectionSubtypeElement(typeElement): {
			// collections use what would otherwise be their last path element as a key -- offset the value
			recursive = ElementGuard.RecursiveCollectableTypeElement(subtype)

			max = (recursive ? RECURSIVE_PATH_ELEMENTS_MAX : 1) - 1
			min = RECURSIVE_PATH_ELEMENTS_MIN - 1

			break
		}
		case ElementGuard.RecursiveCollectableTypeElement(typeElement): {
			// recursive collectables should have 1-3 path elements (plus a key)
			recursive = ElementGuard.RecursiveCollectableTypeElement(typeElement)

			max = recursive ? RECURSIVE_PATH_ELEMENTS_MAX : 1
			min = 1
			break
		}
		case ElementGuard.NonRecursiveCollectableTypeElement(typeElement): {
			// other collectables should have 1 path element (plus a key)
			recursive = false

			max = 1
			min = 1
			break
		}

		case ElementGuard.NonCollectableType(typeElement): {
			// non-collectable items should have 0 path elements (plus a key)
			recursive = false
			max = 0
			min = 0
			break
		}

		default:
			throw new IdError(id, `"${typeElement}" is not a valid Datasworn type.`)
	}

	if (collectionKeys.length > max || collectionKeys.length < min)
		throw new IdError(
			id,
			`Expected ${min === max ? min : `${min}-${max}`} path elements, but got ${
				collectionKeys.length
			}`
		)

	// Filter for invalid path elements
	const badElements = [...collectionKeys, key].filter((el) => {
		if (recursive && ElementGuard.Globstar(el)) {
			wildcard = true
			return false
		}
		if (ElementGuard.Wildcard(el)) {
			wildcard = true
			return false
		}
		if (ElementGuard.DictKey(el)) return false
		return true
	})

	if (badElements.length > 0)
		throw new IdError(
			id,
			`Received invalid path elements: ${JSON.stringify(badElements)}`
		)

	// check the final element, which represents the key of the object
	if (ElementGuard.Wildcard(key)) {
		wildcard = true
	} else if (ElementGuard.Globstar(key)) {
		// only recursive collections allow recursive wildcards as a key
		if (!ElementGuard.RecursiveCollectionSubtypeElement(typeElement))
			throw new IdError(
				id,
				`"${String(
					key as any
				)}" may only be used in the last position (the key) by recursive collection wildcards..`
			)

		wildcard = true
	} else if (!ElementGuard.DictKey(key))
		throw new IdError(
			id,
			`"${String(key as any)}" is not a valid Datasworn dictionary key.`
		)

	// if (!IdElementGuard.RecursiveCollectionSubtypeElement(type) && ) {

	// }

	const parsed = {
		id,
		rulesPackage,
		typeElements: typeElement,
		collectionKeys,
		key,
		wildcard,
		recursive,
		dictionaryType
	} as ParsedId<T>

	return parsed
}

export type ParsedId<T extends AnyId = AnyId> = T extends RecursiveCollectionId
	? ParsedRecursiveCollectionId
	: T extends NonRecursiveCollectionId
	  ? ParsedNonRecursiveCollectionId
	  : T extends RecursiveCollectableId
	    ? ParsedRecursiveCollectableId
	    : T extends NonRecursiveCollectableId
	      ? ParsedNonRecursiveCollectableId
	      : T extends NonCollectableId
	        ? ParsedNonCollectableId
	        : AnyParsedId

export type AnyParsedId =
	| ParsedRecursiveCollectionId
	| ParsedRecursiveCollectableId
	| ParsedNonRecursiveCollectionId
	| ParsedNonRecursiveCollectableId
	| ParsedNonCollectableId

export type ParsedCollectionId =
	| ParsedRecursiveCollectionId
	| ParsedNonRecursiveCollectionId
export type ParsedCollectableId =
	| ParsedRecursiveCollectableId
	| ParsedNonRecursiveCollectableId

type DictionaryType = 'collection' | 'collectable' | 'non_collectable'

export interface ParsedIdBase<T extends AnyId = AnyId> {
	/** The original ID. */
	id: T
	/** The ID of the RulesPackage that contains this ID. */
	rulesPackage: RulesPackageId
	/** The type of object that this ID belongs to. */
	typeElements: ExtractTypeElements<T>
	/** Path elements representing the keys of any ancestor collections. */
	collectionKeys: DictKey[]
	/** The key of the identified item in its parent Dictionary. */
	key: DictKey
	recursive: boolean
	wildcard: boolean
	collectable: boolean
}

interface ParsedRecursiveCollectionId<
	T extends RecursiveCollectionId = RecursiveCollectionId
> extends ParsedIdBase<T> {
	collectionKeys: [] | [DictKey] | [DictKey, DictKey]
	recursive: true
}

interface ParsedRecursiveCollectableId<
	T extends RecursiveCollectableId = RecursiveCollectableId
> extends ParsedIdBase<T> {
	collectionKeys: [DictKey] | [DictKey, DictKey] | [DictKey, DictKey, DictKey]
	recursive: true
	collectable: true
}

interface ParsedNonRecursiveCollectionId<
	T extends NonRecursiveCollectionId = NonRecursiveCollectionId
> extends ParsedIdBase<T> {
	collectionKeys: []
	recursive: false
	collectable: false
}

interface ParsedNonRecursiveCollectableId<
	T extends NonRecursiveCollectableId = NonRecursiveCollectableId
> extends ParsedIdBase<T> {
	collectionKeys: [DictKey]
	recursive: false
	collectable: true
}

interface ParsedNonCollectableId<T extends NonCollectableId = NonCollectableId>
	extends ParsedIdBase<T> {
	recursive: false
	collectionKeys: []
	collectable: false
}

export function extractCollectionIdSubtype<T extends CollectionId>(str: T) {
	const [_pkg, _type, subtype, ..._tail] = str.split(Const.Sep) as [
		string,
		Const.CollectionTypeElement,
		ExtractCollectedTypeElement<T>,
		...string[]
	]

	return subtype
}

export function getRootKeyForType<T extends TypeElement>(
	typeElement: T
): RootKeyForTypeElement<T> {
	if (ElementGuard.CollectionSubtypeElement(typeElement))
		return extractCollectionIdSubtype(typeElement) as RootKeyForTypeElement<T>

	return typeElement as RootKeyForTypeElement<T>
}
