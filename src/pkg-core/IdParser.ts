import nanomatch from 'nanomatch'
import type * as Datasworn from './Datasworn.js'

import { CONST, TypeElements, TypeGuard } from './IdElements/index.js'
import ObjectGlobber from './ObjectGlobPath/ObjectGlobber.js'
import { ParseError } from './Id/Errors.js'
import type * as Strings from './Id/Strings.js'
import {
	type CollectableType,
	type CollectionSubtype,
	type TypeForTypeComposite
} from './Id/TypeMaps.js'
import type * as Utils from './Id/Utils.js'

type DataswornTree =
	| Record<string, Datasworn.RulesPackage>
	| Map<string, Datasworn.RulesPackage>

/**
 * Creates, parses, and locates Datasworn IDs in the Datasworn tree. Id utilities are collected here as static methods.
 * @see
 * @remarks Set the {@linkcode #datasworn} static property to provide a default value for {@link get} and {@link getMatches}
 * @example
 * // create a collectable ID valid as a child of a given collection ID
 * IdParser.from('my_oracles/collections/oracles/core').createChildCollectableId('theme') // returns parser subclass instance for an OracleRollable ID: 'my_oracles/oracles/core/theme'
 */
abstract class IdParser<
		RulesPackage extends string = string,
		TypeKeys extends IdParser.UnknownTypeKeys = IdParser.UnknownTypeKeys,
		PathKeys extends IdParser.UnknownPathKeys = IdParser.UnknownPathKeys,
		IdentifiedObject extends object = object
	>
	implements IdParser.Options<RulesPackage, TypeKeys, PathKeys>, IdParser.Any
{
	/**
	 * @param options Options for construction of an ID.
	 */
	constructor(options: IdParser.Options<RulesPackage, TypeKeys, PathKeys>) {
		// this.#options = options
		this.#rulesPackage = options.rulesPackage
		this.#typeKeys = options.typeKeys
		this.#pathKeys = options.pathKeys
		// this.#collectionKeys = options.collectionKeys
		// this.#key = options.key
	}

	static #datasworn: DataswornTree | null = null

	/** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
	static get datasworn() {
		return IdParser.#datasworn
	}

	static set datasworn(value) {
		IdParser.#datasworn = value
	}

	get id(): string {
		return this.elements.join(CONST.Sep) as any
	}

	get pathKeys() {
		return this.#pathKeys
	}

	toString(): this['id'] {
		return this.id
	}

	// valueOf(): ReturnType<this['toString']> {
	// 	return this.toString() as any
	// }

	// toJSON(): ReturnType<this['toString']> {
	// 	return this.valueOf()
	// }

	// get typeElements() {
	// 	return (
	// 		this.subtype == null ? [this.typeKeys] : [this.typeKeys, this.subtype]
	// 	) as Subtype extends null ? [Type] : [Type, Subtype]
	// }

	/** The parsed elements of the ID as an array of strings. */
	get elements(): string[] {
		return [this.rulesPackage, ...this.typeKeys, ...this.pathKeys]
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

	#rulesPackage: RulesPackage
	public get rulesPackage(): RulesPackage {
		return this.#rulesPackage
	}

	public set rulesPackage(value: RulesPackage) {
		if (IdParser.#validateRulesPackage(value))
			throw new Error(
				`${value as any} is not a valid RulesPackageId or wildcard ("*").`
			)
		this.#resetCachedProperties()
		this.#rulesPackage = value
	}

	readonly #typeKeys: TypeKeys
	public get typeKeys(): TypeKeys {
		return this.#typeKeys
	}

	/** The subtype element for this ID, or `null` if it has no subtype. */
	get subtype(): string | null {
		return this.typeKeys[1] ?? null
	}

	/** The primary type element for this ID. */
	get type(): string {
		return this.typeKeys[0]
	}

	/** Key elements that represent ancestor collection keys. */
	get ancestorCollectionKeys() {
		return this.pathKeys.slice(0, -1) as [] | string[]
	}

	/** The last `pathKey` element, which represents the key for the identified object. */
	get key(): string {
		return this.pathKeys.at(-1)
	}

	readonly #pathKeys: PathKeys

	// #collectionKeys: CollectionKeys
	// public get collectionKeys(): CollectionKeys {
	// 	return this.#collectionKeys
	// }

	// public set collectionKeys(value: CollectionKeys) {
	// 	try {
	// 		Id.#validateCollectionKeys(value, this.typeKeys, this.subtype)
	// 	} catch (err) {
	// 		throw new Error(err)
	// 	}

	// 	this.#resetCachedProperties()
	// 	this.#collectionKeys = value
	// }

	// #key: Key
	// public get key(): Key {
	// 	return this.#key
	// }

	// public set key(value: Key) {
	// 	// TODO: more specific error messages for type
	// 	if (!Id.#validateKey(value, this.isRecursive, this.isCollection))
	// 		throw new Error(`key must be a valid dictionary key or wildcard`)
	// 	this.#resetCachedProperties()
	// 	this.#key = value
	// }

	/** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
	get isWildcard() {
		return this.elements.some(TypeGuard.AnyWildcard)
	}

	/** Does this ID contain recursive elements? */
	get isRecursive() {
		return (
			TypeGuard.RecursiveCollectableType(this.type) ??
			TypeGuard.RecursiveCollectableType(this.subtype)
		)
	}

	/** Does this ID refer to a collectable object? */
	get isCollectable() {
		return TypeGuard.CollectableType(this.type)
	}

	/** Does this ID refer to a collection? */
	get isCollection() {
		return TypeGuard.CollectionType(this.type)
	}

	/** The key of the root object for this type within a RulesPackage. */
	get typeRootKey(): keyof Datasworn.RulesPackage {
		return (
			TypeGuard.CollectionType(this.type) ? this.subtype : this.type
		) as keyof Datasworn.RulesPackage
	}

	#path: null | ObjectGlobber = null

	toPath(): ObjectGlobber {
		if (this.#path == null) {
			const path = IdParser.toPath(this)
			this.#path = path
			return path as any
		}
		return this.#path
	}

	/**
	 * Retrieves the object referenced by this ID.
	 * @throws If the ID is a wildcard ID (use {@link getMatches} instead), or if the referenced object doesn't exist.
	 */
	get(tree = IdParser.datasworn): IdentifiedObject {
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
	getMatches(tree = IdParser.datasworn): IdentifiedObject[] {
		if (tree == null)
			throw new Error(
				`Please set the static (${IdParser.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`
			)

		// non-wildcarded IDs are technically valid wildcard IDs; if this is the case, wrap it in an array and return it
		if (!this.isWildcard)
			try {
				return [this.get(tree)] as any
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
	 * Create an Id parser instance of the appropriate subclass from a RecursiveCollectionId.
	 * @throws If `id` is invalid.
	 */
	static from<T extends Strings.RecursiveCollectionId>(
		id: T
	): RecursiveCollectionId.FromString<T>

	/**
	 * Create an Id parser subclass instance from a NonRecursiveCollectionId.
	 * @throws If `id` is invalid.
	 */
	static from<T extends Strings.NonRecursiveCollectionId>(
		id: T
	): NonRecursiveCollectionId.FromString<T>
	/**
	 * Create an Id parser subclass instance from a NonCollectableId.
	 * @throws If `id` is invalid.
	 */
	static from<T extends Strings.NonCollectableId>(
		id: T
	): NonCollectableId.FromString<T>
	/**
	 * Create an Id parser subclass instance from a RecursiveCollectableId.
	 * @throws If `id` is invalid.
	 */
	static from<T extends Strings.RecursiveCollectableId>(
		id: T
	): RecursiveCollectableId.FromString<T>
	/**
	 * Create an Id parser subclass instance from a NonRecursiveCollectableId.
	 * @throws If `id` is invalid.
	 */
	static from<T extends Strings.NonRecursiveCollectableId>(
		id: T
	): NonRecursiveCollectableId.FromString<T>

	// static from<T extends Strings.AnyId>(
	// 	id: T
	// ): Id<
	// 	Utils.ExtractRulesPackage<T>,
	// 	Utils.ExtractTypeElements<T>,
	// 	Utils.ExtractPathKeys<T>
	// > & { id: T }

	/**
	 * Create an Id parser instance of the appropriate subclass from a string ID.
	 * @throws If `id` is invalid.
	 */
	static from(id: Strings.AnyId): IdParser {
		const { rulesPackage, typeKeys, pathKeys } = IdParser.parse(id as any)
		const [type, subtype] = typeKeys

		switch (true) {
			case TypeGuard.NonCollectableType(type):
				return new NonCollectableId(
					rulesPackage,
					type,
					...(pathKeys as [string])
				) as any
			case TypeGuard.NonRecursiveCollectableType(type):
				return new NonRecursiveCollectableId(
					rulesPackage,
					type,
					...(pathKeys as [string, string])
				) as any
			case TypeGuard.RecursiveCollectableType(type):
				return new RecursiveCollectableId(
					rulesPackage,
					type,
					...(pathKeys as any)
				) as any
			case TypeGuard.CollectionType(type) &&
				TypeGuard.RecursiveCollectableType(subtype):
				return new RecursiveCollectionId(
					rulesPackage,
					subtype,
					...(pathKeys as any)
				) as any
			case TypeGuard.CollectionType(type) &&
				TypeGuard.NonRecursiveCollectableType(subtype):
				return new NonRecursiveCollectionId(
					rulesPackage,
					subtype,
					...(pathKeys as [string])
				) as any
			default:
				throw new ParseError(id, `Couldn't parse ID into a recognized subclass`)
		}
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found.
	 */
	static get<T extends Strings.AnyId>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): Utils.TypeForId<T>
	static get<T extends IdParser<any, any, any, any>>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): ReturnType<T['get']>
	static get<T extends Strings.AnyId | IdParser<any, any, any, any>>(
		id: T,
		tree = IdParser.#datasworn
	): object {
		const parsedId: IdParser<any, any, any, any> =
			id instanceof IdParser ? id : (IdParser.from(id as any) as any)

		return parsedId.toPath().walk(tree as any)
	}

	static toString<T extends IdParser.AnyParsedId>({
		rulesPackage,
		typeKeys,
		pathKeys
	}: T) {
		return [rulesPackage, ...typeKeys, ...pathKeys].join(
			CONST.Sep
		) as T extends IdParser.Parsed<infer U>
			? U
			: Utils.Join<
					[T['rulesPackage'], ...T['typeKeys'], ...T['pathKeys']],
					CONST.Sep
			  >
	}

	/**
	 * Parses a Datasworn string ID into substrings and returns an object identifying each substring.
	 * @param id The Datasworn ID to parse.
	 * @throws If `id` is an invalid Datasworn ID.
	 */
	static parse<T extends Strings.NonRecursiveCollectionId>(
		id: T
	): IdParser.Parsed<T>
	static parse<T extends Strings.NonRecursiveCollectableId>(
		id: T
	): IdParser.Parsed<T>
	static parse<T extends Strings.RecursiveCollectionId>(
		id: T
	): IdParser.Parsed<T>
	static parse<T extends Strings.RecursiveCollectableId>(
		id: T
	): IdParser.Parsed<T>
	static parse<T extends Strings.NonCollectableId>(id: T): IdParser.Parsed<T>
	static parse<T extends Strings.AnyId>(id: T): IdParser.Parsed<T>
	static parse(id: string): IdParser.AnyParsedId {
		const [rulesPackage, primaryType, ...pathKeys] = id.split(CONST.Sep) as [
			string,
			TypeElements.AnyPrimary,
			...string[]
		]
		// ) as [ExtractRulesPackageId<Id>, AnyPrimary, ...DictKey[]]

		// validate first element (rules package id)
		if (
			!TypeGuard.RulesPackageId(rulesPackage) &&
			!TypeGuard.Wildcard(rulesPackage)
		)
			throw new ParseError(
				id,
				`"${String(rulesPackage as any)}" is not a valid Datasworn package ID.`
			)

		// validate second element (primary type)
		if (!TypeGuard.AnyType(primaryType))
			throw new ParseError(
				id,
				`"${primaryType as any}" is not a valid Datasworn type.`
			)

		const result = {
			rulesPackage,
			pathKeys,
			typeKeys: [primaryType]
		}

		// if it's a collection, validate the next element as the collection subtype
		if (TypeGuard.CollectionType(primaryType)) {
			const subtype = result.pathKeys.shift() as any

			if (!TypeGuard.CollectableType(subtype))
				throw new ParseError(
					id,
					`"${subtype}" not a valid Datasworn collectable type.`
				)

			result.typeKeys.push(subtype)
		}

		// ensure that any remaining collectionKeys are the correct length

		let min, max: number

		switch (true) {
			case TypeGuard.NonRecursiveCollectableType(primaryType):
				min = max = 2
				break
			case TypeGuard.RecursiveCollectableType(primaryType):
				min = 2
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX + 1
				break
			case TypeGuard.RecursiveCollectionSubtype(result.typeKeys):
				min = 1
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX
				break
			default:
				min = max = 1
		}

		if (result.pathKeys.length > max || result.pathKeys.length < min)
			throw new ParseError(
				id,
				`Expected ${
					min === max ? min : `${min}-${max}`
				} path elements before the key, but got ${result.pathKeys.length}`
			)

		// validate ancestor collection keys

		const isCollection = TypeGuard.CollectionType(primaryType)
		const isRecursive =
			TypeGuard.RecursiveCollectableType(primaryType) ||
			TypeGuard.RecursiveCollectionSubtype(result.typeKeys)

		const badCollectionKeys = result.pathKeys.filter(
			(key) => !this.#validateCollectionKey(key, isRecursive)
		)

		if (badCollectionKeys.length > 0)
			throw new ParseError(
				id,
				`Received invalid ancestor collection keys: ${JSON.stringify(
					badCollectionKeys
				)}`
			)

		// ensure that only recursive collections have a globstar (**) in the last pathKey position
		if (
			TypeGuard.Globstar(result.pathKeys.at(-1)) &&
			!(isCollection && isRecursive)
		)
			throw new ParseError(
				id,
				`Received a recursive wildcard as a key for a non-recursive collection type`
			)

		return result as any
	}

	static fromOptions<T extends IdParser.AnyParsedId>(
		options: T
	): IdParser<T['rulesPackage'], T['typeKeys'], T['pathKeys']>
	static fromOptions<
		RulesPackage extends string,
		TypeKeys extends IdParser.UnknownTypeKeys,
		PathKeys extends IdParser.UnknownPathKeys
	>({
		rulesPackage,
		typeKeys,
		pathKeys
	}: {
		rulesPackage: RulesPackage
		typeKeys: TypeKeys
		pathKeys: PathKeys
	}): IdParser<RulesPackage, TypeKeys, PathKeys>
	static fromOptions(options: IdParser.AnyParsedId): IdParser {
		const { rulesPackage, typeKeys, pathKeys } = options
		const [type, subtype] = typeKeys

		switch (true) {
			case TypeGuard.NonCollectableType(type):
				return new NonCollectableId(
					rulesPackage,
					type,
					...(pathKeys as [string])
				) as any
			case TypeGuard.NonRecursiveCollectableType(type):
				return new NonRecursiveCollectableId(
					rulesPackage,
					type,
					...(pathKeys as [string, string])
				) as any
			case TypeGuard.RecursiveCollectableType(type):
				return new RecursiveCollectableId(
					rulesPackage,
					type,
					...(pathKeys as any)
				) as any
			case TypeGuard.CollectionType(type) &&
				TypeGuard.RecursiveCollectableType(subtype):
				return new RecursiveCollectionId(
					rulesPackage,
					subtype,
					...(pathKeys as any)
				) as any
			case TypeGuard.CollectionType(type) &&
				TypeGuard.NonRecursiveCollectableType(subtype):
				return new NonRecursiveCollectionId(
					rulesPackage,
					subtype,
					...(pathKeys as [string])
				) as any
			default:
				throw new ParseError(
					IdParser.toString(options),
					`Parsed ID doesn't belong to a known ID type, and can't be assigned a subclass.`
				)
		}
	}

	/** Converts an ID to an array of strings representing the property keys that must be traversed to reach the identified object. */
	static toPath<T extends Strings.AnyId>(id: T): ObjectGlobber
	static toPath<T extends IdParser.AnyParsedId>(options: T): ObjectGlobber
	static toPath<T extends IdParser>(id: T): ObjectGlobber
	static toPath(options: IdParser.AnyParsedId | Strings.AnyId): ObjectGlobber {
		const id: IdParser.Any =
			options instanceof IdParser
				? options
				: typeof options === 'string'
				  ? IdParser.from(options as any)
				  : IdParser.fromOptions(options)

		const dotPathElements: string[] = []

		// e.g. "starforged"
		dotPathElements.push(id.rulesPackage)
		// e.g. "starforged.oracles"
		dotPathElements.push(id.typeRootKey)

		if (id.ancestorCollectionKeys.length > 0) {
			// console.log(id.ancestorCollectionKeys)
			const [rootAncestor, ...ancestors] = id.ancestorCollectionKeys

			// first ancestor collection key is always a key in the root object for the type
			dotPathElements.push(rootAncestor)

			// add path elements to navigate to any further ancestor keys
			for (const collectionKey of ancestors)
				dotPathElements.push(
					// get the collection's dictionary of child collections
					CONST.CollectionsKey,
					// get the child collection by its key
					collectionKey
				)

			// add path to the dictionary that contains the final key
			if (id.isCollection) dotPathElements.push(CONST.CollectionsKey)
			else if (id.isCollectable) dotPathElements.push(CONST.ContentsKey)
		}

		dotPathElements.push(id.key)

		return new ObjectGlobber(...dotPathElements) as any
	}

	static #validateKey(
		key: unknown,
		recursive = false,
		collection = false
	): key is Strings.DictKey {
		if (recursive && collection)
			TypeGuard.AnyWildcard(key) || TypeGuard.DictKey(key)
		return TypeGuard.Wildcard(key) || TypeGuard.DictKey(key)
	}

	static #validateRulesPackage(key: unknown): key is Strings.RulesPackageId {
		return TypeGuard.RulesPackageId(key) || TypeGuard.Wildcard(key)
	}

	static #validateCollectionKey(key: unknown, recursive = false) {
		return recursive
			? TypeGuard.Globstar(key) || this.#validateKey(key)
			: this.#validateKey(key)
	}
}

namespace IdParser {
	/** A generic, un-narrowed ID object with lenient typings. */
	export interface Any extends IdParser.Options {
		readonly id: string
		toString(): string
		readonly elements: string[]
		readonly subtype: string | null
		readonly type: string
		readonly ancestorCollectionKeys: string[]
		readonly key: string
		readonly isWildcard: boolean
		readonly isRecursive: boolean
		readonly isCollectable: boolean
		readonly isCollection: boolean
		readonly typeRootKey: keyof Datasworn.RulesPackage
		toPath(): ObjectGlobber
		get(tree?: DataswornTree | null): object
		getMatches(tree?: DataswornTree | null): object[]
	}

	export type Parsed<T extends Strings.AnyId = Strings.AnyId> = Options<
		Utils.ExtractRulesPackage<T>,
		Utils.ExtractTypeKeys<T>,
		Utils.ExtractPathKeys<T>
	>

	export type UnknownTypeKeys = [string] | [string, string]
	export type UnknownPathKeys = Strings.DictKey[]

	export type Options<
		RulesPackage extends string = string,
		TypeKeys extends UnknownTypeKeys = UnknownTypeKeys,
		PathKeys extends UnknownPathKeys = UnknownPathKeys
	> = {
		/**
		 * The first element of the ID, representing the RulesPackage that the object is from.
		 * @example "classic"
		 * @example "delve"
		 * @example "starforged"
		 */
		rulesPackage: RulesPackage
		/**
		 * 1-2 elements following the RulesPackage element, which indicate the object's type (and possibly subtype)
		 * @example ['oracles']
		 * @example ['collections', 'oracles']
		 */
		typeKeys: TypeKeys
		pathKeys: PathKeys
	}

	export type ToStringArray<
		RulesPackage extends string,
		TypeKeys extends Utils.AnyTypeKeys,
		PathKeys extends Utils.AnyPathKeys
	> = [RulesPackage, ...TypeKeys, ...PathKeys]

	export type ToString<
		RulesPackage extends string,
		TypeKeys extends Utils.AnyTypeKeys,
		PathKeys extends Utils.AnyPathKeys
	> = Utils.Join<ToStringArray<RulesPackage, TypeKeys, PathKeys>, CONST.Sep>

	export type Last<T extends unknown[]> = T extends [infer U]
		? U
		: T extends [...T[number][], infer U]
		  ? U
		  : never

	export type DropLast<T extends unknown[]> = T extends [T[number]]
		? []
		: T extends [...infer U extends T[number][], T[number]]
		  ? U
		  : never

	export type AnyParsedId =
		| IdParser.Parsed<Strings.AnyCollectableId>
		| IdParser.Parsed<Strings.AnyCollectionId>
		| IdParser.Parsed<Strings.NonCollectableId>
}

abstract class CollectionId<
		RulesPackage extends string = string,
		Subtype extends TypeElements.Collectable.Any = TypeElements.Collectable.Any,
		AncestorKeys extends Strings.DictKey[] | [] = Strings.DictKey[],
		Key extends Strings.DictKey = Strings.DictKey
	>
	extends IdParser<
		RulesPackage,
		[TypeElements.Collection, Subtype],
		[...AncestorKeys, Key],
		CollectionSubtype<Subtype>
	>
	implements CollectionId.Any
{
	constructor(
		rulesPackage: RulesPackage,
		subtype: Subtype,
		...pathKeys: [...AncestorKeys, Key]
	) {
		super({
			rulesPackage,
			typeKeys: [TypeElements.Collection, subtype],
			pathKeys
		})
	}

	abstract createChildCollectableId<ChildKey extends string>(
		key: ChildKey
	): CollectableId<RulesPackage, Subtype>
}
namespace CollectionId {
	export type Options<
		T extends Strings.AnyCollectionId = Strings.AnyCollectionId
	> = Omit<IdParser.Parsed<T>, 'type'>
	export type CollectionKeys = [] | [string] | [string, string]
}
interface CollectionId<
	RulesPackage extends string = string,
	Subtype extends TypeElements.Collectable.Any = TypeElements.Collectable.Any,
	AncestorKeys extends Strings.DictKey[] | [] = Strings.DictKey[],
	Key extends Strings.DictKey = Strings.DictKey
> extends IdParser<
		RulesPackage,
		[TypeElements.Collection, Subtype],
		[...AncestorKeys, Key],
		CollectionSubtype<Subtype>
	> {
	get id(): Strings.CollectionId<RulesPackage, Subtype, AncestorKeys, Key>

	get elements(): [
		RulesPackage,
		TypeElements.Collection,
		Subtype,
		...AncestorKeys,
		Key
	]

	get isCollectable(): false
	get isCollection(): true
	get typeRootKey(): Subtype
	get type(): TypeElements.Collection
	get subtype(): Subtype
	get ancestorCollectionKeys(): AncestorKeys
	get pathKeys(): [...AncestorKeys, Key]
	get key(): Key
}
namespace CollectionId {
	/** A lenient typing for a parsed ID representing any collection object. */
	export interface Any extends IdParser.Any {
		readonly id: `${string}/${TypeElements.Collection}/${TypeElements.Collectable.Any}/${string}`
		readonly ancestorCollectionKeys: string[]
		readonly typeRootKey: TypeElements.Collectable.Any
		readonly elements: [
			string,
			TypeElements.Collection,
			TypeElements.Collectable.Any,
			...string[]
		]
		readonly type: TypeElements.Collection
		readonly subtype: TypeElements.Collectable.Any
		readonly typeKeys: [TypeElements.Collection, TypeElements.Collectable.Any]
		readonly isCollectable: false
		readonly isCollection: true
		get(tree?: DataswornTree | null): CollectionSubtype
		getMatches(tree?: DataswornTree | null): CollectionSubtype[]
	}
}

abstract class CollectableId<
		RulesPackage extends string = string,
		Type extends TypeElements.Collectable.Any = TypeElements.Collectable.Any,
		AncestorKeys extends Strings.DictKey[] = Strings.DictKey[],
		Key extends Strings.DictKey = Strings.DictKey
	>
	extends IdParser<
		RulesPackage,
		[Type],
		[...AncestorKeys, Key],
		CollectableType<Type>
	>
	implements CollectableId.Any
{
	constructor(
		rulesPackage: RulesPackage,
		type: Type,
		...pathKeys: [...AncestorKeys, Key]
	) {
		super({
			rulesPackage,
			typeKeys: [type],
			pathKeys
		})
	}

	/** Returns a new {@link IdParser} instance for the ID of this object's parent collection, if one exists. */
	abstract getParentCollectionId(): unknown
}
interface CollectableId<
	RulesPackage extends string = string,
	Type extends TypeElements.Collectable.Any = TypeElements.Collectable.Any,
	AncestorKeys extends Strings.DictKey[] = Strings.DictKey[],
	Key extends Strings.DictKey = Strings.DictKey
> extends IdParser<
		RulesPackage,
		[Type],
		[...AncestorKeys, Key],
		CollectableType<Type>
	> {
	get elements(): [RulesPackage, Type, ...AncestorKeys, Key]

	get isCollectable(): true
	get isCollection(): false
	get typeRootKey(): Type

	get type(): Type
	get subtype(): null
	get ancestorCollectionKeys(): AncestorKeys
	get key(): Key
}
namespace CollectableId {
	/** A lenient typing for a parsed ID representing any collectable object. */
	export interface Any extends IdParser.Any {
		// readonly id: Strings.AnyCollectableId
		readonly typeKeys: [TypeElements.Collectable.Any]
		readonly ancestorCollectionKeys: string[]
		readonly type: TypeElements.Collectable.Any
		readonly typeRootKey: TypeElements.Collectable.Any
		readonly elements: [string, TypeElements.Collectable.Any, ...string[]]
		readonly subtype: null
		readonly isCollectable: true
		readonly isCollection: false
		get(tree?: DataswornTree | null): CollectableType
		getMatches(tree?: DataswornTree | null): CollectableType[]
	}
}

/**
 * Represents an ID for a non-collectable Datasworn object (a {@link Truth}, {@link DelveSite}, {@link DelveSiteTheme}, {@link DelveSiteDomain}, or {@link Rarity}).
 */
class NonCollectableId<
		RulesPackage extends string = string,
		Type extends TypeElements.NonCollectable = TypeElements.NonCollectable,
		Key extends string = string
	>
	extends IdParser<RulesPackage, [Type], [Key], TypeForTypeComposite<Type>>
	implements IdParser.Any
{
	constructor(rulesPackage: RulesPackage, type: Type, key: Key) {
		super({ rulesPackage, typeKeys: [type], pathKeys: [key] })
	}
}
namespace NonCollectableId {
	export type FromString<T extends Strings.NonCollectableId> =
		T extends `${infer RulesPackage}/${infer Type extends
			TypeElements.NonCollectable}/${infer Key}`
			? NonCollectableId<RulesPackage, Type, Key> & { id: T }
			: never
}
interface NonCollectableId<
	RulesPackage extends string = string,
	Type extends TypeElements.NonCollectable = TypeElements.NonCollectable,
	Key extends string = string
> extends IdParser<RulesPackage, [Type], [Key], TypeForTypeComposite<Type>> {
	get elements(): [RulesPackage, Type, Key]
	get id(): Strings.NonCollectableId<RulesPackage, Type, Key>

	get isCollectable(): false
	get isCollection(): false
	get isRecursive(): false
	get typeRootKey(): Type
	get type(): Type
	get subtype(): null
	get ancestorCollectionKeys(): []
	get key(): Key
}

/**
 * Represents an ID for a {@link Move} or {@link Asset}
 */
class NonRecursiveCollectableId<
	RulesPackage extends string,
	Type extends TypeElements.Collectable.NonRecursive,
	ParentKey extends string,
	Key extends string
> extends CollectableId<RulesPackage, Type, [ParentKey], Key> {
	getParentCollectionId(): NonRecursiveCollectionId<
		RulesPackage,
		Type,
		ParentKey
	> {
		const result = new NonRecursiveCollectionId(
			this.rulesPackage,
			this.type,
			...this.ancestorCollectionKeys
		)
		return result
	}
}
interface NonRecursiveCollectableId<
	RulesPackage extends string,
	Type extends TypeElements.Collectable.NonRecursive,
	ParentKey extends string,
	Key extends string
> extends CollectableId<RulesPackage, Type, [ParentKey], Key> {
	get isRecursive(): false
	get elements(): [RulesPackage, Type, ParentKey, Key]
	get id(): Strings.NonRecursiveCollectableId<
		RulesPackage,
		Type,
		ParentKey,
		Key
	>
}
namespace NonRecursiveCollectableId {
	export type FromString<T extends Strings.NonRecursiveCollectableId> =
		T extends `${infer RulesPackage}/${infer Type extends
			TypeElements.Collectable.NonRecursive}/${infer ParentKey}/${infer Key}`
			? NonRecursiveCollectableId<RulesPackage, Type, ParentKey, Key> & {
					id: T
			  }
			: never
}

/** Represents an ID for a {@link MoveCategory} or {@link AssetCollection} */
class NonRecursiveCollectionId<
	RulesPackage extends string,
	Subtype extends TypeElements.Collectable.NonRecursive,
	Key extends string
> extends CollectionId<RulesPackage, Subtype, [], Key> {
	createChildCollectableId<ChildKey extends string>(key: ChildKey) {
		return new NonRecursiveCollectableId(
			this.rulesPackage,
			this.subtype,
			this.key,
			key
		)
	}
}
interface NonRecursiveCollectionId<
	RulesPackage extends string,
	Subtype extends TypeElements.Collectable.NonRecursive,
	Key extends string
> extends CollectionId<RulesPackage, Subtype, [], Key> {
	get isRecursive(): false
	get elements(): [RulesPackage, TypeElements.Collection, Subtype, Key]
	get id(): Strings.NonRecursiveCollectionId<RulesPackage, Subtype, Key>
}

namespace NonRecursiveCollectionId {
	export type FromString<T extends Strings.NonRecursiveCollectionId> =
		T extends `${infer RulesPackage}/${TypeElements.Collection}/${infer Subtype extends
			TypeElements.Collectable.NonRecursive}/${infer Key}`
			? NonRecursiveCollectionId<RulesPackage, Subtype, Key> & { id: T }
			: never
}

class RecursiveCollectableId<
	RulesPackage extends string = string,
	Type extends
		TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive,
	AncestorKeys extends Strings.CollectionPathKeys = Strings.CollectionPathKeys,
	Key extends string = string
> extends CollectableId<RulesPackage, Type, AncestorKeys, Key> {
	getParentCollectionId() {
		return new RecursiveCollectionId(
			this.rulesPackage,
			this.type,
			...this.ancestorCollectionKeys
		)
	}
}

interface RecursiveCollectableId<
	RulesPackage extends string = string,
	Type extends
		TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive,
	AncestorKeys extends Strings.CollectionPathKeys = Strings.CollectionPathKeys,
	Key extends string = string
> extends CollectableId<RulesPackage, Type, AncestorKeys, Key> {
	get elements(): [RulesPackage, Type, ...AncestorKeys, Key]

	get id(): Strings.RecursiveCollectableId<
		RulesPackage,
		Type,
		AncestorKeys,
		Key
	>
	get isRecursive(): true
	get ancestorCollectionKeys(): AncestorKeys
}

namespace RecursiveCollectableId {
	export type FromString<T extends Strings.RecursiveCollectableId> =
		T extends Strings.RecursiveCollectableId<
			infer RulesPackage,
			infer Type,
			infer AncestorKeys,
			infer Key
		>
			? RecursiveCollectableId<RulesPackage, Type, AncestorKeys, Key> & {
					id: T
			  }
			: never
}

/**
 * Represents an ID for a {@link OracleCollection}, {@link NpcCollection}, or {@link Atlas}
 */
class RecursiveCollectionId<
	RulesPackage extends string = string,
	Subtype extends
		TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive,
	AncestorKeys extends
		Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys,
	Key extends string = string
> extends CollectionId<RulesPackage, Subtype, AncestorKeys, Key> {
	createChildCollectableId<ChildKey extends string>(childKey: ChildKey) {
		const result = new RecursiveCollectableId<
			RulesPackage,
			Subtype,
			// @ts-expect-error TS doesn't handle spreads/tuples very well
			[...AncestorKeys, Key],
			ChildKey
		>(this.rulesPackage, this.subtype, ...this.pathKeys, childKey)

		return result
	}

	/**
	 * Create an ID to represent a child collection of this recursive collection ID.
	 * @param childKey The key to use for the child collection.
	 * @returns A new IdParser instance for the child collection ID.
	 * @throws If this collection has already reached its maximum recursion depth (3).
	 * @example
	 * ```typescript
	 * const collectionId = new IdParser('starforged/collections/oracles/planets')
	 * const childCollectionId = collectionId.createChildCollectionId('furnace')
	 * console.log(childCollectionId.id) // "starforged/collections/oracles/planets/furnace"
	 * ```
	 */
	createChildCollectionId<ChildKey extends string>(
		childKey: ChildKey
	): this['canHaveCollectionChild'] extends true
		? RecursiveCollectionId<
				RulesPackage,
				Subtype,
				AncestorKeys extends [string] | [] ? [...AncestorKeys, Key] : never,
				ChildKey
		  >
		: never {
		if (this.pathKeys.length >= CONST.RECURSIVE_PATH_ELEMENTS_MAX)
			throw new Error(
				`Child collection would have a recursion depth of ${
					this.pathKeys.length + 1
				} (max is ${CONST.RECURSIVE_PATH_ELEMENTS_MAX})`
			)

		return new RecursiveCollectionId<
			RulesPackage,
			Subtype,
			// @ts-expect-error TS doesn't handle spreads/tuples very well
			[...AncestorKeys, Key],
			ChildKey
		>(this.rulesPackage, this.subtype, ...this.pathKeys, childKey) as any
	}

	/**
	 * Returns a new {@link RecursiveCollectionId} instance for the ID of this object's parent RecursiveCollection, if one exists.
	 */
	getParentCollectionId() {
		if (this.ancestorCollectionKeys.length === 0) return null

		const result = new RecursiveCollectionId<
			RulesPackage,
			Subtype,
			IdParser.DropLast<AncestorKeys>,
			IdParser.Last<AncestorKeys>
		>(this.rulesPackage, this.subtype, ...(this.ancestorCollectionKeys as any))

		return result as AncestorKeys extends [] ? never : typeof result
	}

	get canHaveCollectionChild() {
		return (this.ancestorCollectionKeys.length >=
			CONST.RECURSIVE_PATH_ELEMENTS_MAX) as AncestorKeys extends Array<string> & {
			length: 1 | 2
		}
			? true
			: false
	}
}
interface RecursiveCollectionId<
	RulesPackage extends string = string,
	Subtype extends
		TypeElements.Collectable.Recursive = TypeElements.Collectable.Recursive,
	AncestorKeys extends
		Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys,
	Key extends string = string
> extends CollectionId<RulesPackage, Subtype, AncestorKeys, Key> {
	get id(): Strings.RecursiveCollectionId<
		RulesPackage,
		Subtype,
		AncestorKeys,
		Key
	>

	get isRecursive(): true
}
namespace RecursiveCollectionId {
	export type FromString<T extends Strings.RecursiveCollectionId> =
		T extends `${infer RulesPackage}/${TypeElements.Collection}/${infer Subtype extends
			TypeElements.Collectable.Recursive}/${string}`
			? RecursiveCollectionId<
					RulesPackage,
					Subtype,
					Utils.ExtractAncestorCollectionPathElements<T>,
					Utils.ExtractKey<T>
			  > & { id: T }
			: never

	export interface Options<T extends Strings.RecursiveCollectionId>
		extends CollectionId.Options<T> {}
}

// const id = new RecursiveCollectionId({
// 	rulesPackage: 'sundered_isles',
// 	subtype: 'oracles',
// 	collectionKeys: ['foo'] as const,
// 	key: 'bar'
// })

export {
	IdParser,
	NonCollectableId,
	NonRecursiveCollectableId,
	NonRecursiveCollectionId,
	RecursiveCollectableId,
	RecursiveCollectionId
}
