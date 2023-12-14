import { CollectionsKey, ContentsKey } from '../const.js'
import {
	type AnyRecursiveCollection,
	type AnyCollectable,
	type CollectionOf,
	type AnyNonRecursiveCollection
} from '../types.js'

export function forEveryCollectionIn<
	T extends AnyNonRecursiveCollection | AnyRecursiveCollection
>(
	collectionDictionary: Record<string, T>,
	/** Return true to force it to stop recursing */
	forEach: (collection: T, key: string, parent?: T) => boolean | undefined,
	parentCollection?: T
) {
	for (const key in collectionDictionary) {
		if (
			!Object.hasOwn(collectionDictionary, key) ||
			collectionDictionary[key] == null
		)
			continue

		const collection = collectionDictionary[key]

		const forceStop = !!forEach(collection, key, parentCollection)

		if (
			forceStop ||
			!(CollectionsKey in collection) ||
			collection[CollectionsKey] == null
		)
			continue

		const dictionary = collection[CollectionsKey] as Record<string, T>

		forEveryCollectionIn(dictionary, forEach, collection)
	}
}

export function forEveryCollectableIn<T extends AnyCollectable>(
	collectionDictionary: Record<string, CollectionOf<T>>,
	forEach: (collectable: T, key: string, collection: CollectionOf<T>) => void
) {
	forEveryCollectionIn(collectionDictionary, (collection, key, parent) => {
		const contents = collection[ContentsKey]
		if (contents != null)
			for (const k in contents) {
				if (Object.hasOwn(contents, k)) forEach(contents[k], k, collection)
			}
		return true
	})
}
