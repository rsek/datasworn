import { ParsedId, extractSubtype, parseId } from './parseId.js'
import {
	type AnyId,
	type DataswornTree,
	type TypeByElement,
	NonCollectableId,
	type InferTypeFromId,
	type NonCollectableTypeElement,
	type NonRecursiveCollectableTypeElement,
	type CollectionSubtypeElement,
	CollectionContentsKey,
	RecursiveCollectableTypeElement,
	AnyRecursiveCollection
} from './const.js'
import { getById } from './getById.js'
import type * as Datasworn from '../types/Datasworn.js'
import IdElementGuard from './IdElementGuard.js'

export function getByWildcardId<T extends AnyId>(
	id: T,
	tree: DataswornTree
): InferTypeFromId<T>[] {
	const parsed = parseId(id as any)

	// if it's not actually wildcarded, we can just skip to getById
	if (!parsed.isWildcard) return [getById(id as any, tree)] as any[]

	const rulesPackagesToCheck: Datasworn.RulesPackage[] = []

	if (IdElementGuard.Wildcard(parsed.rulesPackage)) {
		rulesPackagesToCheck.push(...Object.values(tree))
	} else {
		// TODO
		if (Object.hasOwn(tree, parsed.rulesPackage))
			rulesPackagesToCheck.push(tree[parsed.rulesPackage])
	}

	console.log(
		'checking packages',
		rulesPackagesToCheck.map((item) => item.id)
	)

	if (rulesPackagesToCheck.length === 0) return []

	if (IdElementGuard.NonCollectableTypeElement(parsed.type))
		return _getWildcardNonCollectable(
			rulesPackagesToCheck,
			parsed.type,
			parsed.key
		) as any[]

	if (IdElementGuard.NonRecursiveCollectionSubtypeElement(parsed.type))
		return _getWildcardCollection(
			rulesPackagesToCheck,
			extractSubtype(parsed.type),
			parsed.key
		) as any

	if (IdElementGuard.NonRecursiveCollectableTypeElement(parsed.type)) {
		return _getWildcardCollectable(
			rulesPackagesToCheck,
			parsed.type,
			parsed.path[0] as string,
			parsed.key
		) as any
	}
}

function _getDictionaryMatches<T extends Record<string, any>>(
	dictionary: T,
	keyOrWildcard: string
): T[keyof T][] {
	if (IdElementGuard.Wildcard(keyOrWildcard)) return Object.values(dictionary)

	if (
		Object.hasOwn(dictionary, keyOrWildcard) &&
		dictionary[keyOrWildcard] != null
	)
		return [dictionary[keyOrWildcard]]

	return []
}

// function _getRecursiveCollectionMatches<T extends AnyRecursiveCollection>(
// 	dictionary: Record<string, T>,
// 	pathElements: string[],
// 	results: T[] = []
// ) {
// 	const currentElement = pathElements.shift()

// 	if (IdElementGuard.RecursiveWildcard(currentElement)) {
// 	} else {
// 		results.push()
// 	}

// 	if (pathElements.length > 0) return _getRecursiveCollectionMatches()
// }

function _getWildcardNonCollectable<T extends NonCollectableTypeElement>(
	packages: Datasworn.RulesPackage[],
	type: T,
	keyOrWildcard: string
): TypeByElement<T>[] {
	const results: TypeByElement<T>[] = []

	for (const pkg of packages) {
		if (Object.hasOwn(pkg, type)) {
			const dictionary = pkg[type] as Record<string, TypeByElement<T>>

			results.push(..._getDictionaryMatches(dictionary, keyOrWildcard))
		}
	}

	return results
}

function _getWildcardCollection<T extends NonRecursiveCollectableTypeElement>(
	packages: Datasworn.RulesPackage[],
	type: T,
	keyOrWildcard: string
) {
	const results: TypeByElement<CollectionSubtypeElement<T>>[] = []

	for (const pkg of packages) {
		if (Object.hasOwn(pkg, type)) {
			const dictionary = (pkg as any)[type] as Record<string, TypeByElement<T>>
			results.push(..._getDictionaryMatches(dictionary, keyOrWildcard))
		}
	}

	return results
}

function _getWildcardCollectable<T extends NonRecursiveCollectableTypeElement>(
	packages: Datasworn.RulesPackage[],
	type: T,
	collectionKeyOrWildcard: string,
	keyOrWildcard: string
) {
	console.log(type, collectionKeyOrWildcard, keyOrWildcard)

	const result: TypeByElement<T>[] = []

	for (const pkg of packages) {
		if (Object.hasOwn(pkg, type)) {
			const dictionary = pkg[type] as Record<
				string,
				TypeByElement<CollectionSubtypeElement<T>>
			>
			const collections = _getDictionaryMatches(
				dictionary,
				collectionKeyOrWildcard
			)

			for (const collection of collections) {
				if (Object.hasOwn(collection, CollectionContentsKey)) {
					const innerDictionary = collection[CollectionContentsKey]
					if (innerDictionary != null)
						result.push(
							...(_getDictionaryMatches(
								innerDictionary,
								keyOrWildcard
							) as TypeByElement<T>[])
						)
				}
			}
		}
	}

	return result
}

// function _getWildcardCollectionRecursive<T extends RecursiveCollectableTypeElement>(packages: Datasworn.RulesPackage[], )

// function _getWildcardCollectableRecursive
