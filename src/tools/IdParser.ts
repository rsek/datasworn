import nanomatch from 'nanomatch'
import { type RulesPackage } from '../schema/RulesPackages.js'
import ElementGuard from './ElementGuard.js'
import ObjectGlobber from './ObjectGlobber.js'
import { CollectionsKey, ContentsKey, Sep, type TypeElement } from './const.js'
import { IdError } from './error.js'
import { type ParsedId, type ParsedIdBase } from './parseId.js'
import {
	type AnyId,
	type DictKey,
	type ExtractCollectedTypeElement,
	type ExtractTypeElements,
	type PathForId,
	type RootKeyForId,
	type RulesPackageId,
	type TypeForId
} from './types.js'

type _IdOptions<T extends AnyId> = Pick<
	ParsedId<T>,
	'rulesPackage' | 'typeElements' | 'collectionKeys' | 'key'
>

type IdOptions<T extends AnyId> = Partial<{
	[P in keyof _IdOptions<T>]: _IdOptions<T>[P] extends []
		? _IdOptions<T>[P]
		: never
}> & {
	[P in keyof _IdOptions<T>]: _IdOptions<T>[P] extends []
		? never
		: _IdOptions<T>[P]
}

// TODO - try this as "extends String" ? not sure it's a good idea -- most string functions don't actually apply here.
// TODO: add some more constants as statics

export class IdParser<T extends AnyId = AnyId> implements ParsedIdBase<T> {
	/** The maximum depth for nesting collections, relative to the root  */
	static readonly RECURSIVE_MAX_DEPTH = 3 as const
	/** The separator character for datasworn IDs */
	static readonly SEP = '/' as const

	/** An optional reference to the Datasworn tree object. Used as the default value for several traversal methods. */
	static datasworn: Record<string, RulesPackage> | null = null

	readonly #source: T | IdOptions<T>

	get id(): T {
		return this.#elements.join(IdParser.SEP) as T
	}

	valueOf() {
		return this.id
	}

	get #elements() {
		return [
			this.rulesPackage,
			...this.typeElements,
			...this.collectionKeys,
			this.key
		]
	}

	#resetLazyProperties() {
		this.#matcher = null
		this.#matches = null
		this.#path = null
	}

	#matcher: null | ((str: string) => boolean) = null
	get matcher() {
		if (this.#matcher == null) {
			const matcher = nanomatch.matcher(this.id)
			this.#matcher = matcher
			return matcher
		}

		return this.#matcher
	}

	// TODO: setters validate the new value
	#rulesPackage: ParsedId<T>['rulesPackage']
	public get rulesPackage(): ParsedId<T>['rulesPackage'] {
		return this.#rulesPackage
	}

	// public set rulesPackage(value: ParsedId<T>['rulesPackage']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#rulesPackage = value
	// }

	#typeElements: ParsedIdBase<T>['typeElements']
	public get typeElements(): ParsedIdBase<T>['typeElements'] {
		return this.#typeElements
	}

	// public set typeElements(value: ParsedIdBase<T>['typeElements']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#typeElements = value
	// }

	#collectionKeys: ParsedId<T>['collectionKeys']
	public get collectionKeys(): ParsedId<T>['collectionKeys'] {
		return this.#collectionKeys
	}

	// public set collectionKeys(value: ParsedId<T>['collectionKeys']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#collectionKeys = value
	// }

	#key: ParsedId<T>['key']
	public get key(): ParsedId<T>['key'] {
		return this.#key
	}

	// public set key(value: ParsedId<T>['key']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#key = value
	// }

	// flag getters
	get recursive() {
		return ElementGuard.CollectionType(this.typeElements[0])
			? ElementGuard.RecursiveCollectionSubtype(this.typeElements)
			: ElementGuard.RecursiveCollectableType(this.typeElements[0])
	}

	get wildcard() {
		return this.#elements.some(ElementGuard.AnyWildcard)
	}

	get collectable() {
		return ElementGuard.CollectableType(
			this.typeElements[0]
		) as ParsedId<T>['collectable']
	}

	get collection() {
		return ElementGuard.CollectionType(this.typeElements[0])
	}

	get typeRootKey(): RootKeyForId<T> {
		return (
			this.collection ? this.typeElements[1] : this.typeElements[0]
		) as any
	}

	#path = null

	toPath() {
		if (this.#path == null) {
			const path = IdParser.toPath(this)
			this.#path = path
			return path
		}
		return this.#path
	}

	/**
	 * Retrieves the object referenced by this ID.
	 * @throws If the ID is a wildcard ID, and if the referenced object doesn't exist.
	 */
	get(tree = IdParser.datasworn): TypeForId<T> {
		if (tree == null)
			throw new Error(
				`Please set the static (${IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
			)
		return IdParser.get<T>(this, tree)
	}

	#matches: TypeForId<T>[] | null = null

	/**
	 * Retrieves all objects referenced by this wildcard ID.
	 */
	getMatches(tree = IdParser.datasworn): TypeForId<T>[] {
		if (tree == null)
			throw new Error(
				`Please set the static (${IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
			)
		if (this.#matches != null) return this.#matches

		const matches = IdParser.getMatches<T>(this, tree)
		this.#matches = matches
		return matches
	}

	/**
	 *
	 * @param id The ID string to be parsed, or options for construction an ID.
	 */
	constructor(id: T)
	constructor(id: IdOptions<T>)
	constructor(id: string | IdOptions<T>) {
		const parsed = typeof id === 'string' ? IdParser.parse(id as any) : id
		this.#source = id as any
		this.#rulesPackage = parsed.rulesPackage
		// @ts-expect-error
		this.#typeElements = parsed.typeElements ?? []
		this.#collectionKeys = parsed.collectionKeys ?? []
		this.#key = parsed.key
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found.
	 */
	static get<Id extends AnyId>(
		id: Id | ParsedId<Id> | Id<Id>,
		tree = IdParser.datasworn
	): TypeForId<Id> {
		const parsedId = id instanceof IdParser ? id : new IdParser<Id>(id as any)

		// @ts-expect-error ffs
		return parsedId.toPath().walk(tree)
	}

	static getMatches<Id extends AnyId>(
		id: Id | IdParser<Id>,
		tree = IdParser.datasworn
	): TypeForId<Id>[] {
		const parsedId = id instanceof IdParser ? id : new IdParser<Id>(id as any)

		// technically a non-wildcarded ID is a valid wildcard; in this case we can just return an array with one result
		if (!parsedId.wildcard) return [IdParser.get(id, tree)]

		if (tree == null)
			throw new Error(
				`Please set the static (${IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
			)

		return parsedId.toPath().getMatches(tree, (value) => {
			if (typeof value !== 'object' || value == null) return false
			if (!('id' in value)) return false
			const { id } = value
			if (typeof id !== 'string') return false
			const isMatch = parsedId.matcher(id)
			// console.log('found ID', isMatch ? '(match)' : '(no match)', id)
			return isMatch
		})
	}

	toString() {
		return this.valueOf()
	}

	toJSON() {
		return this.valueOf()
	}

	/**
	 * Parses a Datasworn string ID into substrings, and
	 * @param id The Datasworn ID to parse.
	 */
	static parse<Id extends AnyId>(id: Id) {
		const [rulesPackage, typeElement, ...collectionKeys] = id.split(Sep) as [
			RulesPackageId,
			TypeElement,
			...DictKey[]
		]

		const typeElements = [typeElement] as ExtractTypeElements<Id>

		// validate first element (rules package id)
		if (
			!ElementGuard.RulesPackage(rulesPackage) &&
			!ElementGuard.Wildcard(rulesPackage)
		)
			throw new IdError(
				id,
				`"${String(rulesPackage as any)}" is not a valid Datasworn package ID.`
			)

		// validate second element (type)
		if (!ElementGuard.AnyType(typeElement))
			throw new IdError(
				id,
				`"${typeElement as any}" is not a valid Datasworn type.`
			)

		// if it's a collection, validate the next element as the collection subtype
		if (ElementGuard.CollectionType(typeElement)) {
			const subtype =
				// @ts-expect-error gotta love a type error caused by thorough run-time type checking
				collectionKeys.shift() as ExtractCollectedTypeElement<Id>

			if (!ElementGuard.CollectableType(subtype))
				throw new IdError(
					id,
					`"${subtype}" not a valid Datasworn collectable type.`
				)
			// @ts-expect-error ditto
			typeElements.push(subtype)
		}

		// Extract the key for this object in its parent dictionary, which is always the last element. this gets validated later so that errors are thrown according to their order in the string
		const key = collectionKeys.pop() as DictKey

		// ensure that any remaining collectionKeys are the correct length

		let min, max: number

		switch (true) {
			case ElementGuard.NonRecursiveCollectableType(typeElement):
				min = max = 1
				break
			case ElementGuard.RecursiveCollectableType(typeElement):
				min = 1
				max = this.RECURSIVE_MAX_DEPTH
				break
			case ElementGuard.RecursiveCollectionSubtype(typeElements):
				min = 0
				max = this.RECURSIVE_MAX_DEPTH - 1
				break
			default:
				min = max = 0
		}

		if (collectionKeys.length > max || collectionKeys.length < min)
			throw new IdError(
				id,
				`Expected ${
					min === max ? min : `${min}-${max}`
				} path elements before the key, but got ${collectionKeys.length}`
			)

		// validate ancestor collection keys

		const collection = ElementGuard.CollectionType(typeElement)
		const collectable = ElementGuard.CollectableType(typeElement)
		const recursive =
			ElementGuard.RecursiveCollectableType(typeElement) ||
			ElementGuard.RecursiveCollectionSubtype(typeElements)

		const badCollectionKeys = collectionKeys.filter(
			(key) => !this.#validateCollectionKey(key, recursive)
		)

		if (badCollectionKeys.length > 0)
			throw new IdError(
				id,
				`Received invalid ancestor collection keys: ${JSON.stringify(
					badCollectionKeys
				)}`
			)

		if (collection && !recursive && ElementGuard.Globstar(key))
			throw new IdError(
				id,
				`Received a recursive wildcard as a key for a non-recursive collection type`
			)
		else if (!collection && !this.#validateKey(key))
			throw new IdError(id, `"${key as string}" is not a valid Datasworn key`)

		return {
			rulesPackage,
			typeElements,
			collectionKeys,
			key,
			id,
			collectable, // TODO: prune these
			recursive
		} as ParsedId<Id>
	}

	/** Converts an ID to an array of strings representing the properties needed to reach the identified object. */
	static toPath<T extends AnyId>(
		id: T | IdParser<T>
	): ObjectGlobber<PathForId<T> & PropertyKey[]> {
		const parsed = id instanceof IdParser ? id : new IdParser(id)
		const dotPathElements: string[] = []

		// e.g. "starforged"
		dotPathElements.push(parsed.rulesPackage)
		// e.g. "starforged.oracles"
		dotPathElements.push(parsed.typeRootKey)

		switch (true) {
			case parsed.collection:
				// e.g. "starforged.oracles.planets.collections.furnace"
				for (const pathElement of parsed.collectionKeys)
					dotPathElements.push(pathElement, CollectionsKey)
				dotPathElements.push(parsed.key)
				// special case: key is "**" (a globstar), we need to restrict the results to
				// if (IdElementGuard.RecursiveWildcard(parsed.key))
				// 	dotPathElements.push(CollectionsKey, Wildcard)
				break
			case parsed.collectable:
				{
					// e.g. "starforged.oracles.planets.collections.furnace.contents.life"
					const parentCollectionKey = parsed.collectionKeys.pop() as string
					for (const pathElement of parsed.collectionKeys)
						dotPathElements.push(pathElement, CollectionsKey)
					dotPathElements.push(parentCollectionKey, ContentsKey)
					dotPathElements.push(parsed.key)
				}
				break

			default:
				// non-collectables
				// e.g. "delve.site_themes.hallowed"
				dotPathElements.push(parsed.key)
				break
		}
		return new ObjectGlobber(...dotPathElements) as any
	}

	static #validateKey(key: unknown): key is DictKey {
		return ElementGuard.Wildcard(key) || ElementGuard.DictKey(key)
	}

	static #validateCollectionKey(key: string, recursive = false) {
		return recursive
			? ElementGuard.Globstar(key) || this.#validateKey(key)
			: this.#validateKey(key)
	}
}
