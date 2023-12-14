import { expandId } from './expandId.js'
import {
	AnyCollection,
	CollectionsKey,
	ContentsKey,
	IdForType
} from './types.js'

export function getCollectionPaths<T extends AnyCollection>(
	collection: T,
	{
		results,
		contents,
		collections
	}: {
		results: Set<string[]>
		contents: boolean
		collections: boolean
	} = { results: new Set<string[]>(), contents: true, collections: true }
) {
	const id = collection.id as unknown as IdForType<T>
	const currentPath = expandId(id as any)
	if (contents && ContentsKey in collection)
		for (const k in collection[ContentsKey])
			results.add([...currentPath, ContentsKey, k])
	if (CollectionsKey in collection)
		// collections are always recursed, as we need them to find all 'leaf' nodes for the contents options.
		for (const k in collection[CollectionsKey]) {
			if (collections) results.add([...currentPath, CollectionsKey, k])
			const nextCollection = collection[CollectionsKey][k]
			getCollectionPaths(nextCollection, { results, contents, collections })
		}

	return results
}
