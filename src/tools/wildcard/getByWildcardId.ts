import picomatch from 'picomatch'
import ElementGuard from '../ElementGuard.js'
import {
	getRootKeyForType as getRootKeyForTypeElement,
	parseId,
	type ParsedId
} from '../parseId.js'
import {
	type AnyNonCollectable,
	type AnyNonRecursiveCollectable,
	type AnyNonRecursiveCollection,
	type AnyRecursiveCollection,
	type CollectionOf,
	type AnyIdentified,
	type DataswornTree,
	type IdForType,
	type RootKeyForTypeElement,
	type TypeElement
} from '../types.js'
import { forEveryCollectionIn } from './forEachCollection.js'

type RulesPackage = DataswornTree[string]

export function getByWildcardId<T extends AnyIdentified>(
	id: IdForType<T>,
	tree: DataswornTree
): T[]
export function getByWildcardId<T extends AnyIdentified = AnyIdentified>(
	id: string,
	tree: DataswornTree
): T[] {
	const parsed = parseId(id as IdForType<T>)
	const typeElement = parsed.typeElements

	const rootDictionaries: ReturnType<
		typeof getRootForTypeElement<typeof typeElement>
	>[] = []

	// if there's a wildcard in the first position, any package qualifies if it has an appropriate type root
	if (ElementGuard.Wildcard(parsed.rulesPackage)) {
		for (const k in tree)
			if (
				// check if the package exists
				Object.hasOwn(tree, k) &&
				// check if the package contains the type root
				packageWithType(tree[k], typeElement)
			)
				// matchingPackages.push(tree[k] as any)
				rootDictionaries.push(getRootForTypeElement(tree[k], typeElement))
	} else {
		// otherwise, select the keyed package if it exists and has an appropriate type root
		if (
			Object.hasOwn(tree, parsed.rulesPackage) &&
			packageWithType(tree[parsed.rulesPackage], parsed.typeElements)
		)
			rootDictionaries.push(
				getRootForTypeElement(tree[parsed.rulesPackage], typeElement)
			)
	}

	// return early if there's no matching packages
	if (rootDictionaries.length === 0) return []

	// next element is the type element. Datasworn doesn't allow this to be wildcarded.
	switch (true) {
		case ElementGuard.NonCollectableType(parsed.typeElements):
			return _wildcardNonCollectable(parsed, rootDictionaries) as T[]
		case ElementGuard.RecursiveCollectionSubtypeElement(parsed.typeElements):
			return _wildcardRecursiveCollection(parsed, rootDictionaries) as T[]
		case ElementGuard.NonRecursiveCollectionSubtypeElement(parsed.typeElements):
			return _wildcardNonRecursiveCollection(parsed, rootDictionaries) as T[]
		// TODO: nonrecursive collectables

		default:
			throw new Error('NYI')
	}
}

function _wildcardNonCollectable<T extends AnyNonCollectable>(
	parsedId: ParsedId<IdForType<T>>,
	dictionaries: Record<string, T>[]
) {
	// e.g. "delve/site_themes/*"
	// there's only one possible unresolved wildcard here: the key
	const { key } = parsedId

	return dictionaries.flatMap((dict) => _getDictionaryMatches(dict, key))
}

function _wildcardNonRecursiveCollection<T extends AnyNonRecursiveCollection>(
	parsedId: ParsedId<IdForType<T>>,
	dictionaries: Record<string, T>[]
) {
	// e.g. "starforged/collections/moves/*"
	// only the last element can be an unresolved wildcard

	const { key } = parsedId

	return dictionaries.flatMap((dict) => _getDictionaryMatches(dict, key))
}

function _wildcardNonRecursiveCollectable<T extends AnyNonRecursiveCollectable>(
	parsedId: ParsedId<IdForType<T>>,
	dictionaries: Record<string, CollectionOf<T>>[]
) {
	// e.g. "starforged/moves/*/strike"
	// the last two elements are potential wildcards
	const { collectionKeys: path, key } = parsedId
	const parentKey = path[0] as string

	const results: T[] = []

	// TODO: check the ID w/ picomatch?
	for (const dictionary of dictionaries) {
		_getDictionaryMatches(dictionary, parentKey, (collection) => {
			if (collection.contents != null)
				results.push(
					..._getDictionaryMatches(
						collection.contents as Record<string, T>,
						key
					)
				)
		})
	}
	return results
}

function _getRecursiveCollectionDictionaryMatches<
	T extends AnyRecursiveCollection
>(
	dictionary: Record<string, T>,
	pathElements: string[],
	forEach: (collectionMatch: T, key: string, parent?: T) => undefined
) {
	// recurse until we hit a variable-depth wildcard. if we do, iterate over *all* items from that point. this isn't especially precise, but permits testing them against the wildcard as though it's a glob.

	const currentPathElement = pathElements[0]
	const nextPath = pathElements.slice()

	if (ElementGuard.Globstar(currentPathElement)) {
		forEveryCollectionIn(dictionary, forEach)
	} else {
		_getDictionaryMatches(dictionary, currentPathElement, (match, key) => {
			forEach(match, key)
			const nextDictionary = match.collections as Record<string, T>
			if (nextDictionary != null)
				_getRecursiveCollectionDictionaryMatches(
					nextDictionary,
					nextPath,
					forEach
				)
		})
	}
}

function _wildcardRecursiveCollection<T extends AnyRecursiveCollection>(
	parsedId: ParsedId<IdForType<T>>,
	dictionaries: Record<string, T>[]
) {
	const results: T[] = []
	const { collectionKeys: path, key, id } = parsedId
	const pathElements = [...path, key]

	const matchesAll = path.length === 0 && ElementGuard.Globstar(key)

	// skip all checks if the glob would match everything
	if (matchesAll) {
		for (const dictionary of dictionaries) {
			_getRecursiveCollectionDictionaryMatches(
				dictionary,
				pathElements,
				(match) => {
					results.push(match)
				}
			)
		}
	} else {
		const matcher = picomatch(id)
		for (const dictionary of dictionaries) {
			_getRecursiveCollectionDictionaryMatches(
				dictionary,
				pathElements,
				(match, key) => {
					if (matcher(match.id)) results.push(match)
				}
			)
		}
	}

	return results
}

/** Extracts matching element(s) for the provided key, which may be a wildcard. */
function _getDictionaryMatches<T>(
	dictionary: Record<string, T>,
	keyOrWildcard: string,
	forEach?: (match: T, keyOrWildcard: string) => void
): T[] {
	const matches: T[] = []

	if (
		ElementGuard.Wildcard(keyOrWildcard) ||
		ElementGuard.Globstar(keyOrWildcard)
	)
		for (const match of Object.values(dictionary)) {
			if (typeof forEach === 'function') forEach(match, keyOrWildcard)

			matches.push(match)
		}
	else if (
		Object.hasOwn(dictionary, keyOrWildcard) &&
		dictionary[keyOrWildcard] != null
	) {
		const match = dictionary[keyOrWildcard]
		if (typeof forEach === 'function') forEach(match, keyOrWildcard)
		matches.push(match)
	}

	return matches
}

function packageWithType<T extends TypeElement, Pkg extends RulesPackage>(
	pkg: Pkg,
	typeElement: T
): pkg is Pkg & Required<Pick<Pkg, RootKeyForTypeElement<T>>> {
	const typeRootKey = getRootKeyForTypeElement(typeElement)

	if (!(typeRootKey in pkg)) return false

	const typeRoot = pkg[typeRootKey]

	if (typeRoot == null) return false

	return true
}

function getRootForTypeElement<T extends TypeElement>(
	pkg: RulesPackage,
	typeElement: T
) {
	const typeRootKey = getRootKeyForTypeElement(typeElement)

	return pkg[typeRootKey] as Required<RulesPackage>[RootKeyForTypeElement<T>]
}

// function getWildcardNonCollectables<T extends AnyNonCollectable>(packages:, parsedId: ParsedId<IdForType<T>>) {}

// function _getWildcardCollectables<T extends NonRecursiveCollectable>(
// 	packages: RulesPackage[],
// 	{ type, }: ParsedId<IdForType<T>>
// ) {}
