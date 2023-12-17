import nanomatch from 'nanomatch'
import type * as Datasworn from '../../Datasworn.js'
import { TypeGuard } from '../IdElements/index.js'

import { ParseError } from '../Errors.js'
import CONST from '../IdElements/CONST.js'

import ObjectGlobPath from '../../ObjectGlobPath/ObjectGlobPath.js'
import { type PathForId } from '../../ObjectGlobPath/Path.js'
import type * as IdElements from '../IdElements/index.js'
import type * as Id from '../StringTemplateLiterals.js'
import {
	type ExtractAncestorKeys,
	type ExtractCollectedTypeElement,
	type ExtractIdSelfKey,
	type ExtractRulesPackageId,
	type ExtractTypeElement,
	type RootKeyForId,
	type Split,
	type TypeForId
} from '../Utils.js'
import NonCollectableId from './NonCollectableId.js'
import NonRecursiveCollectableId from './NonRecursiveCollectableId.js'
import RecursiveCollectable from './RecursiveCollectableId.js'
import RecursiveCollectionId from './RecursiveCollectionId.js'
import NonRecursiveCollectionId from './NonRecursiveCollectionId.js'

/**
 * Creates, parses, and locates Datasworn IDs in the Datasworn tree.
 * @remarks Set the {@linkcode datasworn} static property to provide a default value for {@link get} and {@link getMatches}
 */
abstract class IdParser<T extends Id.AnyId = Id.AnyId>
	implements IdParser.Parsed<T>
{
	/** An optional reference to the Datasworn tree object. Used as the default value for several traversal methods. */
	static datasworn: Record<string, Datasworn.RulesPackage> | null = null

	readonly #source: T | IdParser.Options<T>

	toString() {
		return this.elements.join(CONST.Sep) as T
	}

	toJSON() {
		return this.valueOf()
	}

	valueOf() {
		return this.toString()
	}

	/** The parsed elements of the ID as an array of strings.. */
	get elements(): Split<T, CONST.Sep> {
		const elements = [this.rulesPackage, this.type]
		if (this.subtype != null) elements.push(this.subtype)
		elements.push(...this.collectionKeys)
		elements.push(this.key)

		return elements as any
	}

	/** Reset any cached matchers or paths. */
	#resetCachedProperties() {
		this.#matcher = null
		this.#path = null
	}

	#matcher: null | ((str: string) => boolean) = null
	get matcher() {
		if (this.#matcher == null) {
			const matcher = nanomatch.matcher(this.toString())
			this.#matcher = matcher
			return matcher
		}

		return this.#matcher
	}

	#rulesPackage: IdParser.Parsed<T>['rulesPackage']
	public get rulesPackage(): IdParser.Parsed<T>['rulesPackage'] {
		return this.#rulesPackage
	}

	public set rulesPackage(value: IdParser.Parsed<T>['rulesPackage']) {
		if (IdParser.#validateRulesPackage(value))
			throw new Error(
				`${value as any} is not a valid RulesPackageId or wildcard ("*").`
			)
		this.#resetCachedProperties()
		this.#rulesPackage = value
	}

	readonly #type: IdParser.Parsed<T>['type']
	public get type(): IdParser.Parsed<T>['type'] {
		return this.#type
	}

	readonly #subtype: IdParser.Parsed<T>['subtype'] = null
	public get subtype(): IdParser.Parsed<T>['subtype'] {
		return this.#subtype
	}

	#collectionKeys: IdParser.Parsed<T>['collectionKeys']
	public get collectionKeys(): IdParser.Parsed<T>['collectionKeys'] {
		return this.#collectionKeys
	}

	public set collectionKeys(value: IdParser.Parsed<T>['collectionKeys']) {
		try {
			IdParser.#validateCollectionKeys(value, this.type, this.subtype)
		} catch (err) {
			throw new Error(err)
		}

		this.#resetCachedProperties()
		this.#collectionKeys = value
	}

	#key: IdParser.Parsed<T>['key']
	public get key(): IdParser.Parsed<T>['key'] {
		return this.#key
	}

	public set key(value: IdParser.Parsed<T>['key']) {
		// TODO: more specific error messages for type
		if (!IdParser.#validateKey(value, this.isRecursive, this.isCollection))
			throw new Error(`key must be a valid dictionary key or wildcard`)
		this.#resetCachedProperties()
		this.#key = value
	}

	/** Does this ID contain recursive elements? */
	get isRecursive(): T extends
		| Id.RecursiveCollectionId
		| Id.RecursiveCollectableId
		? true
		: false {
		return (
			TypeGuard.CollectionType(this.type)
				? TypeGuard.RecursiveCollectableType(this.subtype)
				: TypeGuard.RecursiveCollectableType(this.type)
		) as any
	}

	/** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
	get isWildcard() {
		return this.elements.some(TypeGuard.AnyWildcard)
	}

	/** Does this ID refer to a collectable object? */
	get isCollectable(): ExtractTypeElement<T> extends IdElements.TypeElements.Collectable.Any
		? true
		: false {
		return TypeGuard.CollectableType(this.type) as any
	}

	/** Does this ID refer to a collection? */
	get isCollection(): T extends Id.AnyCollectionId ? true : false {
		return TypeGuard.CollectionType(this.type) as any
	}

	/** The key of the root object for this type within a RulesPackage. */
	get typeRootKey(): RootKeyForId<T> {
		return this.isCollection ? this.subtype : (this.type as any)
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
		if (this.isWildcard)
			throw new Error(
				`"${this.toString()}" is a wildcard ID. Please use ${
					this.constructor.name
				}.getMatches instead.`
			)

		return this.toPath().walk(tree as any)
	}

	/**
	 * Retrieves all objects matched by this wildcard ID.
	 */
	getMatches(tree = IdParser.datasworn): TypeForId<T>[] {
		if (tree == null)
			throw new Error(
				`Please set the static (${IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
			)

		// non-wildcarded IDs are technically valid wildcard IDs; if this is the case, wrap it in an array and return it
		if (!this.isWildcard)
			try {
				return [this.get(tree)]
			} catch {
				return []
			}
		return this.toPath().getMatches(tree, (value) => {
			if (typeof value !== 'object' || value == null) return false
			if (!('id' in value)) return false
			const { id } = value
			if (typeof id !== 'string') return false
			return this.matcher(id)
		})
	}

	/**
	 * Construct a Datasworn ID from an ID string.
	 * @param id The ID string to be parsed.
	 */
	// @ts-expect-error
	constructor(id: T)
	/**
	 * @param options Options for construction an ID.
	 */
	constructor(options: IdParser.Options<T>)
	/**
	 * @param id The ID string to be parsed, or options for construction an ID.
	 */
	constructor(id: T | IdParser.Options<T>) {
		const parsed = typeof id === 'string' ? IdParser.parse<T>(id) : id
		this.#source = id
		this.#rulesPackage = parsed.rulesPackage
		this.#type = parsed.type as any
		this.#subtype = 'subtype' in parsed ? parsed.subtype : (null as any)
		this.#collectionKeys =
			'collectionKeys' in parsed ? parsed.collectionKeys : ([] as any)
		this.#key = parsed.key as any
	}

	/** Create an IdParser instance of the appropriate subclass from a string ID. */
	static create<Id extends Id.AnyId>(id: Id): IdParser.Subclass<Id> {
		const { rulesPackage, type, collectionKeys, key, subtype } =
			IdParser.parse(id)

		switch (true) {
			case TypeGuard.NonCollectableType(type):
				return new NonCollectableId({ rulesPackage, type, key }) as any
			case TypeGuard.NonRecursiveCollectableType(type):
				return new NonRecursiveCollectableId({
					rulesPackage,
					collectionKey: collectionKeys[0],
					key,
					type
				}) as any
			case TypeGuard.RecursiveCollectableType(type):
				return new RecursiveCollectable({
					rulesPackage,
					collectionKeys,
					type,
					key
				} as any) as any
			case TypeGuard.CollectionType(type) &&
				TypeGuard.RecursiveCollectableType(subtype):
				return new RecursiveCollectionId({
					rulesPackage,
					subtype,
					collectionKeys,
					key
				}) as any
			case TypeGuard.CollectionType(type) &&
				TypeGuard.NonRecursiveCollectableType(subtype):
				return new NonRecursiveCollectionId({
					rulesPackage,
					subtype,
					key
				}) as any
			default:
				throw new ParseError(id, `Couldn't parse ID into a recognized subclass`)
		}
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found.
	 */
	static get<Id extends Id.AnyId>(
		id: Id | IdParser<Id>,
		tree = IdParser.datasworn
	): TypeForId<Id> {
		const parsedId = id instanceof IdParser ? id : IdParser.create(id)

		return parsedId.toPath().walk(tree as any)
	}

	/**
	 * Parses a Datasworn string ID into substrings and returns an object identifying each substring.
	 * @param id The Datasworn ID to parse.
	 */
	static parse<Id extends Id.AnyId>(id: Id): IdParser.Parsed<Id> {
		const [rulesPackage, type, ...collectionKeys] = id.split(
			CONST.Sep
		) as Split<Id, CONST.Sep>
		// ) as [ExtractRulesPackageId<Id>, AnyPrimary, ...DictKey[]]

		let subtype: ExtractCollectedTypeElement<Id & Id.AnyCollectionId> = null

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
		if (!TypeGuard.AnyType(type))
			throw new ParseError(
				id,
				`"${type as any}" is not a valid Datasworn type.`
			)

		// if it's a collection, validate the next element as the collection subtype
		if (TypeGuard.CollectionType(type)) {
			subtype = collectionKeys.shift() as any

			if (!TypeGuard.CollectableType(subtype))
				throw new ParseError(
					id,
					`"${subtype}" not a valid Datasworn collectable type.`
				)
		}

		// Extract the key for this object in its parent dictionary, which is always the last element. this gets validated later so that errors are thrown according to their order in the string
		const key = collectionKeys.pop() as ExtractIdSelfKey<Id>

		// ensure that any remaining collectionKeys are the correct length

		let min, max: number

		switch (true) {
			case TypeGuard.NonRecursiveCollectableType(type):
				min = max = 1
				break
			case TypeGuard.RecursiveCollectableType(type):
				min = 1
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX
				break
			case TypeGuard.RecursiveCollectionSubtype([type, subtype]):
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

		const collection = TypeGuard.CollectionType(type)
		const recursive =
			TypeGuard.RecursiveCollectableType(type) ||
			TypeGuard.RecursiveCollectionSubtype([type, subtype])

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
			type,
			subtype: subtype ?? (null as any),
			collectionKeys: collectionKeys as any,
			key
		} as any
	}

	/** Converts an ID to an array of strings representing the property keys that must be traversed to reach the identified object. */
	static toPath<T extends Id.AnyId>(
		id: IdParser<T>
	): ObjectGlobPath<PathForId<T>> {
		const parsed = id
		const dotPathElements: string[] = []

		// e.g. "starforged"
		dotPathElements.push(parsed.rulesPackage)
		// e.g. "starforged.oracles"
		dotPathElements.push(parsed.typeRootKey)

		switch (true) {
			case parsed.isCollection:
				// e.g. "starforged.oracles.planets.collections.furnace"
				for (const pathElement of parsed.collectionKeys)
					dotPathElements.push(pathElement, CONST.CollectionsKey)
				dotPathElements.push(parsed.key)
				break
			case parsed.isCollectable:
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

	static #validateKey(
		key: unknown,
		recursive = false,
		collection = false
	): key is Id.DictKey {
		if (recursive && collection)
			TypeGuard.AnyWildcard(key) || TypeGuard.DictKey(key)
		return TypeGuard.Wildcard(key) || TypeGuard.DictKey(key)
	}

	static #validateRulesPackage(key: unknown): key is Id.RulesPackageId {
		return TypeGuard.RulesPackageId(key) || TypeGuard.Wildcard(key)
	}

	static #validateCollectionKey(key: unknown, recursive = false) {
		return recursive
			? TypeGuard.Globstar(key) || this.#validateKey(key)
			: this.#validateKey(key)
	}

	static #validateCollectionKeys(
		collectionKeys: unknown[],
		type: IdElements.TypeElements.AnyPrimary,
		subtype: IdElements.TypeElements.Collectable.Any | null = null
	) {
		let min, max: number
		let recursive: boolean

		switch (true) {
			case TypeGuard.NonRecursiveCollectableType(type):
				min = max = 1
				recursive = false
				break
			case TypeGuard.RecursiveCollectableType(type):
				min = 1
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX
				recursive = true
				break
			case TypeGuard.RecursiveCollectionSubtype([type, subtype]):
				min = 0
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX - 1
				recursive = true
				break
			case TypeGuard.NonRecursiveCollectionSubtype([type, subtype]):
			case TypeGuard.NonCollectableType(type):
			default:
				min = max = 0
				recursive = false
		}

		if (collectionKeys.length > max || collectionKeys.length < min)
			throw new Error(
				`Expected ${
					min === max ? min : `${min}-${max}`
				} collection keys, but got ${collectionKeys.length}`
			)

		if (collectionKeys.length === 0) return true

		const badKeys = collectionKeys.filter((k) =>
			this.#validateCollectionKey(k, recursive)
		)

		if (badKeys.length > 0)
			throw new Error(
				`Received invalid collection keys: ${JSON.stringify(badKeys)}`
			)

		return true
	}
}

namespace IdParser {
	export type Subclass<T extends Id.AnyId> = T extends Id.RecursiveCollectionId
		? RecursiveCollectionId<T>
		: T extends Id.NonRecursiveCollectionId
		  ? NonRecursiveCollectionId<T>
		  : T extends Id.NonCollectableId
		    ? NonCollectableId<T>
		    : T extends Id.RecursiveCollectableId
		      ? RecursiveCollectable<T>
		      : T extends Id.NonRecursiveCollectableId
		        ? NonRecursiveCollectableId<T>
		        : IdParser<T>

	export interface Parsed<T extends Id.AnyId = Id.AnyId> {
		/**
		 * The first element of the ID, representing the RulesPackage that the object is from.
		 * @example "classic"
		 * @example "delve"
		 * @example "starforged"
		 */
		rulesPackage: ExtractRulesPackageId<T>
		type: ExtractTypeElement<T>
		subtype: T extends Id.AnyCollectionId
			? ExtractCollectedTypeElement<T>
			: null
		collectionKeys: ExtractAncestorKeys<T>
		key: ExtractIdSelfKey<T>
	}

	type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
	type RecursiveCollectableOptions<
		T extends Id.RecursiveCollectableId = Id.RecursiveCollectableId
	> = SetOptional<Parsed<T>, 'subtype'>
	type NonRecursiveCollectableOptions<
		T extends Id.NonRecursiveCollectableId = Id.NonRecursiveCollectableId
	> = SetOptional<Parsed<T>, 'subtype'>
	type RecursiveCollectionOptions<
		T extends Id.RecursiveCollectionId = Id.RecursiveCollectionId
	> = Parsed<T>
	type NonRecursiveCollectionOptions<
		T extends Id.NonRecursiveCollectionId = Id.NonRecursiveCollectionId
	> = SetOptional<Parsed<T>, 'collectionKeys'>
	type NonCollectableOptions<
		T extends Id.NonCollectableId = Id.NonCollectableId
	> = SetOptional<Parsed<T>, 'collectionKeys' | 'subtype'>

	export type Options<T extends Id.AnyId = Id.AnyId> =
		T extends Id.RecursiveCollectionId
			? RecursiveCollectionOptions<T>
			: T extends Id.NonRecursiveCollectionId
			  ? NonRecursiveCollectionOptions<T>
			  : T extends Id.RecursiveCollectableId
			    ? RecursiveCollectableOptions<T>
			    : T extends Id.NonRecursiveCollectableId
			      ? NonRecursiveCollectableOptions<T>
			      : T extends Id.NonCollectableId
			        ? NonCollectableOptions<T>
			        : Options<T>
}

export default IdParser
