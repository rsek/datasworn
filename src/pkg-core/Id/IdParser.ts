import nanomatch from 'nanomatch'
import type * as Datasworn from '../Datasworn.js'
import { TypeGuard } from './IdElements/index.js'

import { ParseError } from './Errors.js'
import CONST from './IdElements/CONST.js'

import ObjectGlobPath from '../ObjectGlobPath/ObjectGlobPath.js'
import { type PathForId } from '../ObjectGlobPath/Path.js'
import type * as Id from './StringTemplateLiterals.js'
import {
	type ExtractIdAncestorKeys,
	type ExtractRulesPackageId,
	type ExtractIdSelfKey,
	type ExtractTypeElements,
	type RootKeyForId,
	type TypeForId,
	type Split,
	type ExtractCollectedTypeElement
} from './Utils.js'
import type * as IdElements from './IdElements/index.js'

// TODO - try this as "extends String" ? not sure it's a good idea -- most string functions don't actually apply here.
class IdParser<T extends Id.AnyId = Id.AnyId> implements IdParser.Options<T> {
	/** An optional reference to the Datasworn tree object. Used as the default value for several traversal methods. */
	static datasworn: Record<string, Datasworn.RulesPackage> | null = null

	readonly #source: T | IdParser.Options<T>

	get id(): T {
		return this.#elements.join(CONST.Sep) as T
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
	readonly #rulesPackage: IdParser.Options<T>['rulesPackage']
	public get rulesPackage(): IdParser.Options<T>['rulesPackage'] {
		return this.#rulesPackage
	}

	// public set rulesPackage(value: IdParser.Options<T>['rulesPackage']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#rulesPackage = value
	// }

	readonly #typeElements: IdParser.Options<T>['typeElements']
	public get typeElements(): IdParser.Options<T>['typeElements'] {
		return this.#typeElements
	}

	// public set typeElements(value: ParsedIdBase<T>['typeElements']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#typeElements = value
	// }

	readonly #collectionKeys: IdParser.Options<T>['collectionKeys']
	public get collectionKeys(): IdParser.Options<T>['collectionKeys'] {
		return this.#collectionKeys
	}

	// public set collectionKeys(value: IdParser.Options<T>['collectionKeys']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#collectionKeys = value
	// }

	readonly #key: IdParser.Options<T>['key']
	public get key(): IdParser.Options<T>['key'] {
		return this.#key
	}

	// public set key(value: IdParser.Options<T>['key']) {
	// 	// if (!IdParser.fn(value)) throw new Error()
	// 	this.#resetLazyProperties()
	// 	this.#key = value
	// }

	// flag getters
	get recursive() {
		return TypeGuard.CollectionType(this.typeElements[0])
			? TypeGuard.RecursiveCollectionSubtype(this.typeElements)
			: TypeGuard.RecursiveCollectableType(this.typeElements[0])
	}

	get wildcard() {
		return this.#elements.some(TypeGuard.AnyWildcard)
	}

	get collectable(): this['typeElements'] extends [
		IdElements.TypeElements.Collectable.Any
	]
		? true
		: false {
		return TypeGuard.CollectableType(this.typeElements[0]) as any
	}

	get collection() {
		return TypeGuard.CollectionType(this.typeElements[0])
	}

	get typeRootKey(): RootKeyForId<T> {
		return this.collection
			? this.typeElements[1]
			: (this.typeElements[0] as any)
	}

	#path: null | ObjectGlobPath<PathForId<T>> = null

	toPath(): ObjectGlobPath<PathForId<T>> {
		if (this.#path == null) {
			const path = IdParser.toPath(this)
			this.#path = path
			return path as any
		}
		return this.#path
	}

	/**
	 * Retrieves the object referenced by this ID.
	 * @throws If the ID is a wildcard ID (use {@link IdParser.getMatches} instead), or if the referenced object doesn't exist.
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
	 * @param id The ID string to be parsed.
	 */
	constructor(id: T)
	/**
	 *
	 * @param options Options for construction an ID.
	 */
	constructor(options: IdParser.Options<T>)
	/**
	 *
	 * @param id The ID string to be parsed, or options for construction an ID.
	 */
	constructor(id: T | IdParser.Options<T>) {
		const parsed = typeof id === 'string' ? IdParser.parse(id) : id
		this.#source = id
		this.#rulesPackage = parsed.rulesPackage
		this.#typeElements = (parsed.typeElements ?? []) as any
		this.#collectionKeys = (parsed.collectionKeys ?? []) as any
		this.#key = parsed.key
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found.
	 */
	static get<Id extends Id.AnyId>(
		id: Id | IdParser.Options<Id> | IdParser<Id>,
		tree = IdParser.datasworn
	): TypeForId<Id> {
		const parsedId = id instanceof IdParser ? id : new IdParser<Id>(id as any)

		return parsedId.toPath().walk(tree as any)
	}

	static getMatches<Id extends Id.AnyId>(
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
	 * Parses a Datasworn string ID into substrings and returns an object identifying each substring.
	 * @param id The Datasworn ID to parse.
	 */
	static parse<Id extends Id.AnyId>(id: Id): IdParser.Options<Id> {
		const [rulesPackage, typeElement, ...collectionKeys] = id.split(
			CONST.Sep
		) as Split<Id, CONST.Sep>
		// ) as [ExtractRulesPackageId<Id>, AnyPrimary, ...DictKey[]]

		const typeElements = [typeElement] as unknown as ExtractTypeElements<Id>

		// validate first element (rules package id)
		if (
			!TypeGuard.RulesPackageId(rulesPackage) &&
			!TypeGuard.Wildcard(rulesPackage)
		)
			throw new ParseError(
				id,
				`"${String(rulesPackage as any)}" is not a valid Datasworn package ID.`
			)

		// validate second element (type)
		if (!TypeGuard.AnyType(typeElement))
			throw new ParseError(
				id,
				`"${typeElement as any}" is not a valid Datasworn type.`
			)

		// if it's a collection, validate the next element as the collection subtype
		if (TypeGuard.CollectionType(typeElement)) {
			const subtype = collectionKeys.shift() as ExtractCollectedTypeElement<
				Id & Id.CollectionId
			>

			if (!TypeGuard.CollectableType(subtype))
				throw new ParseError(
					id,
					`"${subtype}" not a valid Datasworn collectable type.`
				)
			// @ts-expect-error ditto
			typeElements.push(subtype)
		}

		// Extract the key for this object in its parent dictionary, which is always the last element. this gets validated later so that errors are thrown according to their order in the string
		const key = collectionKeys.pop() as ExtractIdSelfKey<Id>

		// ensure that any remaining collectionKeys are the correct length

		let min, max: number

		switch (true) {
			case TypeGuard.NonRecursiveCollectableType(typeElement):
				min = max = 1
				break
			case TypeGuard.RecursiveCollectableType(typeElement):
				min = 1
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX
				break
			case TypeGuard.RecursiveCollectionSubtype(typeElements):
				min = 0
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX - 1
				break
			default:
				min = max = 0
		}

		if (collectionKeys.length > max || collectionKeys.length < min)
			throw new ParseError(
				id,
				`Expected ${
					min === max ? min : `${min}-${max}`
				} path elements before the key, but got ${collectionKeys.length}`
			)

		// validate ancestor collection keys

		const collection = TypeGuard.CollectionType(typeElement)
		const recursive =
			TypeGuard.RecursiveCollectableType(typeElement) ||
			TypeGuard.RecursiveCollectionSubtype(typeElements)

		const badCollectionKeys = collectionKeys.filter(
			(key) => !this.#validateCollectionKey(key, recursive)
		)

		if (badCollectionKeys.length > 0)
			throw new ParseError(
				id,
				`Received invalid ancestor collection keys: ${JSON.stringify(
					badCollectionKeys
				)}`
			)

		if (collection && !recursive && TypeGuard.Globstar(key))
			throw new ParseError(
				id,
				`Received a recursive wildcard as a key for a non-recursive collection type`
			)
		else if (!collection && !this.#validateKey(key))
			throw new ParseError(
				id,
				`"${key as string}" is not a valid Datasworn key`
			)

		return {
			rulesPackage,
			typeElements,
			collectionKeys: collectionKeys as string[] as ExtractIdAncestorKeys<Id>,
			key
		}
	}

	/** Converts an ID to an array of strings representing the properties needed to reach the identified object. */
	static toPath<T extends Id.AnyId>(
		id: T | IdParser<T>
	): ObjectGlobPath<PathForId<T>> {
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
					dotPathElements.push(pathElement, CONST.CollectionsKey)
				dotPathElements.push(parsed.key)
				break
			case parsed.collectable:
				{
					// e.g. "starforged.oracles.planets.collections.furnace.contents.life"
					const parentCollectionKey = parsed.collectionKeys.pop() as string
					for (const pathElement of parsed.collectionKeys)
						dotPathElements.push(pathElement, CONST.CollectionsKey)
					dotPathElements.push(parentCollectionKey, CONST.ContentsKey)
					dotPathElements.push(parsed.key)
				}
				break

			default:
				// non-collectables
				// e.g. "delve.site_themes.hallowed"
				dotPathElements.push(parsed.key)
				break
		}
		return new ObjectGlobPath(...dotPathElements) as any
	}

	static #validateKey(key: unknown): key is Id.DictKey {
		return TypeGuard.Wildcard(key) || TypeGuard.DictKey(key)
	}

	static #validateCollectionKey(key: string, recursive = false) {
		return recursive
			? TypeGuard.Globstar(key) || this.#validateKey(key)
			: this.#validateKey(key)
	}
}

namespace IdParser {
	export interface Options<T extends Id.AnyId = Id.AnyId> {
		rulesPackage: ExtractRulesPackageId<T>
		typeElements: ExtractTypeElements<T>
		collectionKeys: ExtractIdAncestorKeys<T>
		key: ExtractIdSelfKey<T>
	}
}

export default IdParser
