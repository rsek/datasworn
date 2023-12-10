import type * as Types from '../types/Datasworn.js'
import {
	type DictKey,
	type CollectionSubtypeElement,
	type NonCollectableTypeElement,
	type CollectableTypeElement,
	Sep,
	type AnyId,
	type CollectableId,
	type DataswornTree,
	type TypeByElement,
	type CollectionId,
	type NonCollectableId,
	CollectionContentsKey,
	type AnyCollection,
	CollectionCollectionsKey
} from './const.js'
import IdElementGuard from './IdElementGuard.js'
import { parseId } from './parseId.js'
/**
 * Attempt to retrieve a Datasworn object by its id. This function is for static IDs only; for wildcard IDs, see `getByWildcardId` instead.
 * @param id The ID of the item to retrive.
 * @param tree The Datasworn data tree.
 * @throws If the ID can't be parsed; or if an item corresponding to the ID can't be found;
 */
export function getById<T extends CollectableTypeElement>(
	id: CollectableId<T>,
	tree: DataswornTree
): TypeByElement<T>
export function getById<
	U extends CollectableTypeElement,
	T extends CollectionSubtypeElement<U>
>(id: CollectionId<U>, tree: DataswornTree): TypeByElement<T>
export function getById<T extends NonCollectableTypeElement>(
	id: NonCollectableId<T>,
	tree: DataswornTree
): TypeByElement<T>
export function getById<T extends AnyId>(id: T, tree: DataswornTree) {
	const parsed = parseId(id)

	if (parsed.isWildcard)
		throw new Error(`"${id}" is a wildcard ID, please use getByWildId instead.`)

	const { rulesPackage, key, path, type } = parsed

	if (!Object.hasOwn(tree, rulesPackage))
		throw new Error(
			`"${rulesPackage}" appears to be a valid RulesPackageId, but this key doesn't exist in the Datasworn tree.`
		)

	const data = tree[rulesPackage]

	if (IdElementGuard.CollectableTypeElement(type))
		return _getCollectable(data, type, ...path, key)
	if (IdElementGuard.NonCollectableTypeElement(type))
		return _getNonCollectable(data, type, key)
	if (IdElementGuard.CollectionSubtypeElement(type))
		return _getCollection(
			data,
			IdElementGuard.extractSubtype(type),
			...path,
			key
		)

	throw new Error(`"${String(id)}" appears to be an invalid ID`)
}

function _getNonCollectable<T extends NonCollectableTypeElement>(
	data: Types.RulesPackage,
	type: T,
	key: DictKey
) {
	if (!Object.hasOwn(data, type))
		throw new Error(`"${data.id}" doesn't contain an entry for type ${type}`)

	const dictionary = data[type]

	if (typeof dictionary !== 'object' || dictionary == null)
		throw new Error(
			`Expected an object for "${data.id + Sep + type}" but got ${String(
				dictionary
			)}`
		)

	if (!Object.hasOwn(dictionary, key))
		throw new Error(
			`"${data.id + Sep + type}" doesn't contain an entry for "${String(key)}"`
		)

	return dictionary[key] as TypeByElement<T>
}

function _getCollectable<T extends CollectableTypeElement>(
	data: Types.RulesPackage,
	type: T,
	...pathElements: DictKey[]
): TypeByElement<T> {
	// reserve the last element for key
	const collectableKey = pathElements.pop() as DictKey

	const parentCollection = _getCollection(data, type, ...pathElements)

	if (!Object.hasOwn(parentCollection, CollectionContentsKey))
		throw new Error(
			`"${parentCollection.id}" doesn't have any collectable contents!`
		)

	const parentDictionary = parentCollection[CollectionContentsKey] as Record<
		string,
		TypeByElement<T>
	>

	if (!Object.hasOwn(parentDictionary, collectableKey))
		throw new Error(
			`"${parentCollection.id}" doesn't contain an entry for key "${collectableKey}"`
		)

	const collectable = parentDictionary[collectableKey]

	return collectable
}

function _getCollection<T extends CollectableTypeElement>(
	data: Types.RulesPackage,
	subtype: T,
	...pathElements: DictKey[]
) {
	if (!Object.hasOwn(data, subtype))
		throw new Error(`"${subtype}" doesn't exist in RulesPackage "${data.id}"`)

	const typeDictionary = data[subtype] as Record<
		DictKey,
		TypeByElement<CollectionSubtypeElement<T>>
	>

	return _walkCollectionDictionaries(typeDictionary, ...pathElements)
}

function _walkCollectionDictionaries<T extends AnyCollection>(
	dictionary: Record<DictKey, T>,
	...path: DictKey[]
) {
	const currentPathElement = path.shift()

	if (typeof currentPathElement !== 'string') throw new Error()

	if (!Object.hasOwn(dictionary, currentPathElement))
		throw new Error(`No entry for key "${currentPathElement}"`)

	const nextCollection = dictionary[currentPathElement]

	if (path.length === 0)
		// target acquired!
		return nextCollection

	if (!Object.hasOwn(nextCollection, CollectionCollectionsKey))
		// path elements remain but there's nothing to recurse
		throw new Error(
			`Couldn't reach "${path.join(Sep)}" from "${nextCollection.id}"`
		)

	const nextDictionary = (
		nextCollection as unknown as {
			[CollectionCollectionsKey]: Record<DictKey, T>
		}
	)[CollectionCollectionsKey]

	return _walkCollectionDictionaries(nextDictionary, ...path)
}
