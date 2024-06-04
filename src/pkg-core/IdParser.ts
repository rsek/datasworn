import type { DropLast, Head, Last } from './Id/ArrayUtils.js'
import { ParseError } from './Id/Errors.js'
import type {
	ExtractAncestorKeys,
	ExtractKey,
	ExtractParentCollectionKey,
	ExtractRulesPackage,
	ExtractTypeId
} from './Id/IdUtils.js'
import type * as Strings from './Id/StringId.js'
import CONST from './IdElements/CONST.js'
import Regex from './IdElements/Regex.js'
import TypeGuard from './IdElements/TypeGuard.js'
import TypeId from './IdElements/TypeId.js'
import ObjectGlobber from './ObjectGlobPath/ObjectGlobber.js'
import type { Datasworn } from './index.js'

export type DataswornTree =
	| Record<string, Datasworn.RulesPackage>
	| Map<string, Datasworn.RulesPackage>

namespace IdParser {
	export type FormatType =
		| 'non_collectable'
		| 'recursive_collectable'
		| 'non_recursive_collectable'
		| 'recursive_collection'
		| 'non_recursive_collection'

	export type Options<
		RulesPackage extends string = string,
		Type extends TypeId.Any = TypeId.Any,
		PathKeys extends Datasworn.DictKey[] = Datasworn.DictKey[]
	> = {
		/**
		 * The first element of the ID, representing the RulesPackage that the object is from.
		 * @example "classic"
		 * @example "delve"
		 * @example "starforged"
		 */
		rulesPackage: RulesPackage
		/**
		 * The second element of the ID, which indicate the object's type. This is the same value as the `type` property of the object.
		 * @example "oracle_rollable"
		 * @example "oracle_collection"
		 * @example "asset"
		 */
		type: Type
		pathKeys: PathKeys
	}
}

abstract class IdParser<
	RulesPackage extends string = string,
	Type extends TypeId.Any = TypeId.Any,
	PathKeys extends string[] = string[]
> implements IdParser.Options<RulesPackage, Type, PathKeys>
{
	constructor({
		rulesPackage,
		type,
		pathKeys
	}: IdParser.Options<RulesPackage, Type, PathKeys>) {
		this.#rulesPackage = rulesPackage
		this.#type = type
		this.#pathKeys = pathKeys
	}

	// ID parts

	#rulesPackage: RulesPackage
	public get rulesPackage(): RulesPackage {
		return this.#rulesPackage
	}

	public set rulesPackage(value: RulesPackage) {
		if (IdParser.#validateRulesPackage(value))
			throw new Error(
				`${value as any} is not a valid RulesPackageId or wildcard ("${CONST.WildcardString}").`
			)
		this.#resetCachedProperties()
		this.#rulesPackage = value
	}

	readonly #type: Type
	public get type(): Type {
		return this.#type
	}

	readonly #pathKeys: PathKeys

	get pathKeys() {
		return this.#pathKeys
	}

	get typeRootKey() {
		return TypeId.typeRootKeys[this.type] as TypeId.TypeRootKey<Type>
	}

	// computed properties

	/** The parsed elements of the ID as an array of strings. */
	get elements(): [RulesPackage, Type, ...PathKeys] {
		return [this.rulesPackage, this.type, ...this.pathKeys]
	}

	get id() {
		return this.elements.join(CONST.Sep)
	}

	toString(): this['id'] {
		return this.id
	}

	/** Key elements that represent ancestor collection keys. */
	get collectionAncestorKeys() {
		return this.pathKeys.slice(0, -1)
	}

	/** The last `pathKey` element, which represents the key for the identified object. */
	get key() {
		return this.pathKeys.at(-1)
	}

	/** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
	get isWildcard() {
		return this.elements.some(TypeGuard.AnyWildcard)
	}

	/** Does this ID contain recursive elements? */
	get isRecursive() {
		return (
			TypeGuard.RecursiveCollectableType(this.type) ||
			TypeGuard.RecursiveCollectionType(this.type)
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

	#matcher: null | RegExp = null

	// Private methods
	/** The regular expression that matches for a wildcard ID. */
	get matcher() {
		if (!(this.#matcher instanceof RegExp))
			this.#matcher = IdParser.#createMatcher(...this.elements)

		return this.#matcher
	}

	static #createMatcher(...elements: string[]) {
		return new RegExp(
			'^' + elements.map(IdParser.#getPatternFragment).join(CONST.Sep) + '$'
		)
	}

	static readonly RulesPackagePattern = Regex.RulesPackageElement
	static readonly DictKeyPattern = Regex.DictKeyElement
	static readonly RecursiveDictKeyPattern = Regex.RecursiveDictKeyElement

	static #getPatternFragment(element: string, index: number) {
		switch (element) {
			case CONST.WildcardString:
				// if it's the first element, return the RulesPackage-specific pattern
				return index === 0
					? IdParser.RulesPackagePattern.source
					: IdParser.DictKeyPattern.source
			case CONST.GlobstarString:
				// TODO: to enforce maximum depth, dynamically generate this pattern based on current recursion level
				return IdParser.RecursiveDictKeyPattern.source

			default:
				return element
		}
	}

	/** Reset any cached matchers or paths. */
	#resetCachedProperties() {
		this.#matcher = null
		this.#globber = null
	}

	/** Lazy prop for this ID's Globber */
	#globber: null | ObjectGlobber = null

	toPath(): ObjectGlobber {
		if (this.#globber == null) {
			const path = IdParser.toPath(this)
			this.#globber = path
			return path as any
		}
		return this.#globber
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
	 */
	static get<T extends Strings.AnyId>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): TypeId.TypeNode<ExtractTypeId<T>>
	static get<T extends IdParser>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): ReturnType<T['get']>
	static get<T extends Strings.AnyId | IdParser>(
		id: T,
		tree = IdParser.datasworn
	) {
		const parsedId: IdParser =
			id instanceof IdParser ? id : (IdParser.fromString(id as any) as any)

		return parsedId.toPath().walk(tree as any)
	}

	get(tree?: (typeof IdParser)['datasworn']) {
		return IdParser.get(this, tree) as TypeId.TypeNode<Type>
	}

	static fromOptions<
		RulesPackage extends string,
		Type extends TypeId.Collection.Recursive,
		CollectionAncestorKeys extends Strings.CollectionAncestorKeys,
		Key extends string
	>(
		options: IdParser.Options<
			RulesPackage,
			Type,
			[...CollectionAncestorKeys, Key]
		>
	): RecursiveCollectionId<RulesPackage, Type, CollectionAncestorKeys, Key>
	static fromOptions<
		RulesPackage extends string,
		Type extends TypeId.Collection.NonRecursive,
		Key extends string
	>(
		options: IdParser.Options<RulesPackage, Type, [Key]>
	): NonRecursiveCollectionId<RulesPackage, Type, Key>
	static fromOptions<
		RulesPackage extends string,
		Type extends TypeId.Collectable.Recursive,
		CollectableAncestorKeys extends Strings.CollectableAncestorKeys,
		Key extends string
	>(
		options: IdParser.Options<
			RulesPackage,
			Type,
			[...CollectableAncestorKeys, Key]
		>
	): RecursiveCollectableId<RulesPackage, Type, CollectableAncestorKeys, Key>
	static fromOptions<
		RulesPackage extends string,
		Type extends TypeId.Collectable.NonRecursive,
		CollectionKey extends string,
		Key extends string
	>(
		options: IdParser.Options<RulesPackage, Type, [CollectionKey, Key]>
	): NonRecursiveCollectableId<RulesPackage, Type, CollectionKey, Key>
	static fromOptions<
		RulesPackage extends string,
		Type extends TypeId.NonCollectable,
		Key extends string
	>(
		options: IdParser.Options<RulesPackage, Type, [Key]>
	): NonCollectableId<RulesPackage, Type, Key>
	static fromOptions(options: IdParser.Options): IdParser {
		this.#validateOptions(options)

		const { rulesPackage, type, pathKeys } = options

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
			case TypeGuard.RecursiveCollectionType(type):
				return new RecursiveCollectionId(
					rulesPackage,
					type,
					...(pathKeys as Strings.CollectionPathKeys)
				) as any
			case TypeGuard.NonRecursiveCollectionType(type):
				return new NonRecursiveCollectionId(
					rulesPackage,
					type,
					...(pathKeys as [string])
				) as any
			default:
				throw new ParseError(
					[rulesPackage, type, ...pathKeys].join(CONST.Sep),
					`Parsed ID doesn't belong to a known ID type, and can't be assigned a subclass.`
				)
		}
	}

	static toPath(options: IdParser.Options | Strings.AnyId): ObjectGlobber {
		const parsedId: IdParser =
			options instanceof IdParser
				? options
				: typeof options === 'string'
					? IdParser.fromString(options as any)
					: IdParser.fromOptions(options as any)

		const dotPathElements: string[] = []

		// e.g. "starforged"
		dotPathElements.push(parsedId.rulesPackage)
		// e.g. "starforged.oracles"
		dotPathElements.push(parsedId.typeRootKey)

		if (parsedId.collectionAncestorKeys.length > 0) {
			// console.log(_id.ancestorCollectionKeys)
			const [rootAncestor, ...ancestors] = parsedId.collectionAncestorKeys

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
			if (parsedId.isCollection) dotPathElements.push(CONST.CollectionsKey)
			else if (parsedId.isCollectable) dotPathElements.push(CONST.ContentsKey)
		}

		dotPathElements.push(parsedId.key)

		return new ObjectGlobber(...dotPathElements) as any
	}

	// Public static  methods

	/**
	 * Parses an ID string in to an IdParser options object.
	 * @throws If it can't parse the ID.
	 */
	static parse(id: string): IdParser.Options {
		const [rulesPackage, type, ...pathKeys] = id.split(CONST.Sep) as [
			string, // RulesPackageId
			string, // TypeId
			...string[] // PathKeys
		]

		const result: IdParser.Options = {
			rulesPackage,
			type: type as TypeId.Any,
			pathKeys
		}

		try {
			this.#validateOptions(result)
		} catch (e) {
			throw new ParseError(id, e)
		}

		return result
	}

	static fromString<T extends Strings.NonRecursiveCollectableId>(
		id: T
	): NonRecursiveCollectableId.FromString<T>
	static fromString<T extends Strings.RecursiveCollectableId>(
		id: T
	): RecursiveCollectableId.FromString<T>
	static fromString<T extends Strings.NonRecursiveCollectionId>(
		id: T
	): NonRecursiveCollectionId.FromString<T>
	static fromString<T extends Strings.RecursiveCollectionId>(
		id: T
	): RecursiveCollectionId.FromString<T>
	static fromString<T extends Strings.NonCollectableId>(
		id: T
	): NonCollectableId.FromString<T>
	static fromString(id: string): IdParser {
		const options = IdParser.parse(id)
		return IdParser.fromOptions(options as any) as any
	}

	/**
	 * @throws If it receives invalid IdParser options.
	 */
	static #validateOptions({ rulesPackage, type, pathKeys }: IdParser.Options) {
		if (!this.#validateRulesPackage(rulesPackage))
			throw new Error(
				`"${String(rulesPackage)}" is not a valid Datasworn package ID or wildcard.`
			)

		// validate type
		const formatType = this.#getFormatType(type)

		// validate path keys
		this.#validatePathKeys(pathKeys, formatType)

		return true
	}

	/**
	 * @throws If it receives an invalid node type.
	 */
	static #getFormatType(typeId: string): IdParser.FormatType {
		switch (true) {
			case TypeGuard.NonCollectableType(typeId):
				return 'non_collectable'
			case TypeGuard.NonRecursiveCollectableType(typeId):
				return 'non_recursive_collectable'
			case TypeGuard.RecursiveCollectableType(typeId):
				return 'recursive_collectable'
			case TypeGuard.NonRecursiveCollectionType(typeId):
				return 'non_recursive_collection'
			case TypeGuard.RecursiveCollectionType(typeId):
				return 'recursive_collection'

			default:
				throw new Error(
					`"${String(typeId)}" is not a valid Datasworn node type.`
				)
		}
	}

	// Static private methods
	static #validateRulesPackage(key: unknown): key is Strings.RulesPackageId {
		return TypeGuard.RulesPackageId(key) || TypeGuard.Wildcard(key)
	}

	/**
	 * @throws If the path keys are invalid for the chosen ID format.
	 */
	static #validatePathKeys(
		pathKeys: unknown[],
		format: IdParser.FormatType
	): pathKeys is Datasworn.DictKey[] {
		let min: number
		let max: number
		let isRecursive: boolean

		switch (format) {
			// collectables get an additional key -- this is the key of the collectable itself
			case 'non_recursive_collectable':
				min = max = CONST.RECURSIVE_PATH_ELEMENTS_MIN + 1
				isRecursive = false
				break
			case 'recursive_collectable':
				min = CONST.RECURSIVE_PATH_ELEMENTS_MIN + 1
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX + 1
				isRecursive = true
				break
			case 'recursive_collection':
				min = CONST.RECURSIVE_PATH_ELEMENTS_MIN
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX
				isRecursive = true
				break
			case 'non_recursive_collection':
			case 'non_collectable':
			default:
				min = max = CONST.RECURSIVE_PATH_ELEMENTS_MIN
				isRecursive = false
		}

		if (pathKeys.length > max || pathKeys.length < min)
			throw new Error(
				`Expected ${
					min === max ? min : `${min}-${max}`
				} path elements, but got ${pathKeys.length}`
			)

		const badCollectionKeys = pathKeys.filter(
			(key) => !this.#validateCollectionKey(key, isRecursive)
		)

		if (badCollectionKeys.length > 0)
			throw new Error(
				`Received invalid ancestor collection keys: ${JSON.stringify(
					badCollectionKeys
				)}`
			)

		if (
			TypeGuard.Globstar(pathKeys.at(-1)) &&
			format !== 'recursive_collection'
		)
			throw new Error(
				`Received a recursive wildcard as a key for a non-recursive collection type`
			)

		return true
	}

	static #validateDictKey(
		key: unknown,
		recursive = false,
		collection = false
	): key is Datasworn.DictKey {
		if (recursive && collection)
			TypeGuard.AnyWildcard(key) || TypeGuard.DictKey(key)
		return TypeGuard.Wildcard(key) || TypeGuard.DictKey(key)
	}

	static #validateCollectionKey(key: unknown, recursive = false) {
		return recursive
			? TypeGuard.Globstar(key) || this.#validateDictKey(key)
			: this.#validateDictKey(key)
	}

	// Static properties

	/** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
	static datasworn: DataswornTree | null = null
}

// derived classes

class NonCollectableId<
	RulesPackage extends string = string,
	Type extends TypeId.NonCollectable = TypeId.NonCollectable,
	Key extends string = string
> extends IdParser<RulesPackage, Type, [Key]> {
	constructor(rulesPackage: RulesPackage, type: Type, key: Key) {
		super({ rulesPackage, type, pathKeys: [key] })
	}
}
interface NonCollectableId<
	RulesPackage extends string = string,
	Type extends TypeId.NonCollectable = TypeId.NonCollectable,
	Key extends string = string
> extends IdParser<RulesPackage, Type, [Key]> {
	get id(): Strings.NonCollectableId<RulesPackage, Type, Key>
	get isCollectable(): false
	get elements(): [RulesPackage, Type, Key]
	get isCollection(): false
	get typeRootKey(): TypeId.TypeRootKey<Type>
	get collectionAncestorKeys(): []
	get pathKeys(): [Key]
	get key(): Key
}

abstract class CollectableId<
	RulesPackage extends string = string,
	Type extends TypeId.Collectable.Any = TypeId.Collectable.Any,
	CollectionPathKeys extends string[] = string[],
	Key extends string = string
> extends IdParser<RulesPackage, Type, [...CollectionPathKeys, Key]> {}
interface CollectableId<
	RulesPackage extends string = string,
	Type extends TypeId.Collectable.Any = TypeId.Collectable.Any,
	CollectionPathKeys extends string[] = string[],
	Key extends string = string
> extends IdParser<RulesPackage, Type, [...CollectionPathKeys, Key]> {
	get isCollectable(): true
	get elements(): [RulesPackage, Type, ...CollectionPathKeys, Key]
	get isCollection(): false
	get typeRootKey(): TypeId.TypeRootKey<Type>
	get collectionAncestorKeys(): CollectionPathKeys
	get pathKeys(): [...CollectionPathKeys, Key]
	get key(): Key
}

interface RecursiveId extends IdParser {
	/** The current collection recursion depth. */
	get recursionDepth(): number
	get isRecursive(): true
}

class NonRecursiveCollectableId<
	RulesPackage extends string = string,
	Type extends
		TypeId.Collectable.NonRecursive = TypeId.Collectable.NonRecursive,
	CollectionKey extends string = string,
	Key extends string = string
> extends CollectableId<RulesPackage, Type, [CollectionKey], Key> {
	constructor(
		rulesPackage: RulesPackage,
		type: Type,
		collectionKey: CollectionKey,
		key: Key
	) {
		super({
			rulesPackage,
			type,
			pathKeys: [collectionKey, key]
		})
	}
}
interface NonRecursiveCollectableId<
	RulesPackage extends string = string,
	Type extends
		TypeId.Collectable.NonRecursive = TypeId.Collectable.NonRecursive,
	CollectionKey extends string = string,
	Key extends string = string
> extends CollectableId<RulesPackage, Type, [CollectionKey], Key> {
	get id(): Strings.NonRecursiveCollectableId<
		RulesPackage,
		Type,
		CollectionKey,
		Key
	>
	get isRecursive(): false
}

class RecursiveCollectableId<
		RulesPackage extends string = string,
		Type extends TypeId.Collectable.Recursive = TypeId.Collectable.Recursive,
		CollectableAncestorKeys extends
			Strings.CollectableAncestorKeys = Strings.CollectableAncestorKeys,
		Key extends string = string
	>
	extends CollectableId<RulesPackage, Type, CollectableAncestorKeys, Key>
	implements RecursiveId
{
	constructor(
		rulesPackage: RulesPackage,
		type: Type,
		...pathKeys: [...CollectableAncestorKeys, Key]
	) {
		super({ rulesPackage, type, pathKeys })
	}

	get recursionDepth(): number {
		return this.collectionAncestorKeys.length
	}
}
interface RecursiveCollectableId<
	RulesPackage extends string = string,
	Type extends TypeId.Collectable.Recursive = TypeId.Collectable.Recursive,
	CollectableAncestorKeys extends
		Strings.CollectableAncestorKeys = Strings.CollectableAncestorKeys,
	Key extends string = string
> extends CollectableId<RulesPackage, Type, CollectableAncestorKeys, Key> {
	get id(): Strings.RecursiveCollectableId<
		RulesPackage,
		Type,
		CollectableAncestorKeys,
		Key
	>
	get isRecursive(): true

  get pathKeys(): [...CollectableAncestorKeys, Key]

	get collectionAncestorKeys(): CollectableAncestorKeys

  get elements(): [RulesPackage,Type,...CollectableAncestorKeys,Key]

}

abstract class CollectionId<
	RulesPackage extends string = string,
	Type extends TypeId.Collection.Any = TypeId.Collection.Any,
	CollectionAncestorKeys extends
		Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys,
	Key extends string = string
> extends IdParser<RulesPackage, Type, [...CollectionAncestorKeys, Key]> {
	constructor(
		rulesPackage: RulesPackage,
		type: Type,
		...pathKeys: [...CollectionAncestorKeys, Key]
	) {
		super({ rulesPackage, type, pathKeys })
	}

	abstract createChild<ChildKey extends string>(
		key: ChildKey
	): CollectableId<
		RulesPackage,
		TypeId.CollectedBy<Type>,
		[...CollectionAncestorKeys, Key],
		ChildKey
	>
}
interface CollectionId<
	RulesPackage extends string = string,
	Type extends TypeId.Collection.Any = TypeId.Collection.Any,
	CollectionAncestorKeys extends
		Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys,
	Key extends string = string
> extends IdParser<RulesPackage, Type, [...CollectionAncestorKeys, Key]> {
	get elements(): [RulesPackage, Type, ...CollectionAncestorKeys, Key]
	get isCollectable(): false
	get isCollection(): true
	get typeRootKey(): TypeId.TypeRootKey<Type>
	get collectionAncestorKeys(): CollectionAncestorKeys
	get pathKeys(): [...CollectionAncestorKeys, Key]
	get key(): Key
}

class RecursiveCollectionId<
		RulesPackage extends string = string,
		Type extends TypeId.Collection.Recursive = TypeId.Collection.Recursive,
		CollectionAncestorKeys extends
			Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys,
		Key extends string = string
	>
	extends CollectionId<RulesPackage, Type, CollectionAncestorKeys, Key>
	implements RecursiveId
{
	createChild<ChildKey extends string>(
		key: ChildKey
	): RecursiveCollectableId<
		RulesPackage,
		TypeId.CollectedBy<Type>,
		[...CollectionAncestorKeys, Key],
		ChildKey
	> {
		return new RecursiveCollectableId(
			this.rulesPackage,
			TypeId.collectedByMap[this.type],
			...this.collectionAncestorKeys,
			this.key,
			key
		)
	}

	createCollectionChild<ChildKey extends string>(
		key: ChildKey
	): this['pathKeys'] extends Strings.CollectionAncestorKeys
		? RecursiveCollectionId<RulesPackage, Type, this['pathKeys'], ChildKey>
		: never {
		if (this.pathKeys.length >= CONST.RECURSIVE_PATH_ELEMENTS_MAX)
			throw new ParseError(
				this.id,
				`Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${CONST.RECURSIVE_PATH_ELEMENTS_MAX})`
			)

		return new RecursiveCollectionId(
			this.rulesPackage,
			this.type,
			...this.pathKeys,
			key
		) as any
	}

	/**
	 * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
	 */
	getParent(): this['collectionAncestorKeys'] extends Strings.CollectionPathKeys
		? RecursiveCollectionId<
				RulesPackage,
				Type,
				DropLast<CollectionAncestorKeys>,
				Last<CollectionAncestorKeys>
			>
		: never {
		if (this.collectionAncestorKeys.length === 0)
			throw new ParseError(
				this.id,
				`Can't generate a parent ID because this ID has no ancestors.`
			)

		return new RecursiveCollectionId(
			this.rulesPackage,
			this.type,
			...(this.collectionAncestorKeys as any)
		) as any
	}

	get recursionDepth(): number {
		return this.pathKeys.length
	}
}
interface RecursiveCollectionId<
	RulesPackage extends string = string,
	Type extends TypeId.Collection.Recursive = TypeId.Collection.Recursive,
	CollectionAncestorKeys extends
		Strings.CollectionAncestorKeys = Strings.CollectionAncestorKeys,
	Key extends string = string
> extends CollectionId<RulesPackage, Type, CollectionAncestorKeys, Key> {
	get pathKeys(): [...CollectionAncestorKeys, Key]

	get id(): Strings.RecursiveCollectionId<
		RulesPackage,
		Type,
		CollectionAncestorKeys,
		Key
	>
	get isRecursive(): true
	get collectionAncestorKeys(): CollectionAncestorKeys

  get elements(): [RulesPackage,Type,...CollectionAncestorKeys,Key]
}

class NonRecursiveCollectionId<
	RulesPackage extends string = string,
	Type extends TypeId.Collection.NonRecursive = TypeId.Collection.NonRecursive,
	Key extends string = string
> extends CollectionId<RulesPackage, Type, [], Key> {
	createChild<ChildKey extends string>(
		key: ChildKey
	): NonRecursiveCollectableId<
		RulesPackage,
		TypeId.CollectedBy<Type>,
		Key,
		ChildKey
	> {
		return new NonRecursiveCollectableId(
			this.type,
			TypeId.collectedByMap[this.type],
			this.key,
			key
		) as any
	}
}
interface NonRecursiveCollectionId<
	RulesPackage extends string = string,
	Type extends TypeId.Collection.NonRecursive = TypeId.Collection.NonRecursive,
	Key extends string = string
> extends CollectionId<RulesPackage, Type, [], Key> {
	get id(): Strings.NonRecursiveCollectionId<RulesPackage, Type, Key>
	get isRecursive(): false
	get pathKeys(): [Key]
  get collectionAncestorKeys(): []
  get elements(): [RulesPackage,Type,Key]
}

namespace NonCollectableId {
	export type FromString<T extends Strings.NonCollectableId> = NonCollectableId<
		ExtractRulesPackage<T>,
		ExtractTypeId<T>,
		ExtractKey<T>
	>
}

namespace NonRecursiveCollectableId {
	export type FromString<T extends Strings.NonRecursiveCollectableId> =
		NonRecursiveCollectableId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractParentCollectionKey<T>,
			ExtractKey<T>
		>
}

namespace RecursiveCollectableId {
	export type FromString<T extends Strings.RecursiveCollectableId> =
		RecursiveCollectableId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractAncestorKeys<T>,
			ExtractKey<T>
		>
}

namespace RecursiveCollectionId {
	export type FromString<T extends Strings.RecursiveCollectionId> =
		RecursiveCollectionId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractAncestorKeys<T>,
			ExtractKey<T>
		>
}
namespace NonRecursiveCollectionId {
	export type FromString<T extends Strings.NonRecursiveCollectionId> =
		NonRecursiveCollectionId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractKey<T>
		>
}

export {
	IdParser,
	NonCollectableId,
	NonRecursiveCollectableId,
	NonRecursiveCollectionId,
	RecursiveCollectableId,
	RecursiveCollectionId
}
