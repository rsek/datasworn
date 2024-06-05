import type { Head, LastElementOf } from './Utils/Array.js'
import { ParseError } from './Errors.js'
import type {
	ExtractAncestorKeys,
	ExtractKey,
	ExtractParentCollectionKey,
	ExtractRulesPackage,
	ExtractTypeId
} from './Utils/Id.js'
import type * as StringId from './StringId.js'
import {
	CONST,
	Pattern,
	TypeGuard,
	NodeTypeId,
	type PathKeys
} from './IdElements/index.js'
import ObjectGlobber from './ObjectGlobber.js'
import type * as DataswornSource from './DataswornSource.js'
import type DataswornNode from './DataswornNode.js'
import type { Tree } from './Tree.js'
import type { Datasworn } from './index.js'

namespace IdParser {
	export type FormatType =
		| 'non_collectable'
		| 'recursive_collectable'
		| 'non_recursive_collectable'
		| 'recursive_collection'
		| 'non_recursive_collection'

	export type Options<
		RulesPackage extends string = string,
		TypeId extends NodeTypeId.Any = NodeTypeId.Any,
		PathKeys extends (DataswornSource.DictKey | number)[] = (
			| DataswornSource.DictKey
			| number
		)[]
	> = {
		/**
		 * The first element of the ID, representing the RulesPackage that the identified node is from.
		 * @example "classic"
		 * @example "delve"
		 * @example "starforged"
		 */
		rulesPackage: RulesPackage
		/**
		 * The second element of the ID, representing the {@link DataswornNode}'s type. This is the same value as the `type` property of the node.
		 * @example "oracle_rollable"
		 * @example "oracle_collection"
		 * @example "asset"
		 */
		typeId: TypeId
		pathKeys: PathKeys
	}
}

abstract class IdParser<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.Any = NodeTypeId.Any,
	PathKeys extends (string | number)[] = (string | number)[]
> implements IdParser.Options<RulesPackage, TypeId, PathKeys>
{
	constructor({
		rulesPackage,
		typeId,
		pathKeys
	}: IdParser.Options<RulesPackage, TypeId, PathKeys>) {
		this.#rulesPackage = rulesPackage
		this.#typeId = typeId
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

	readonly #typeId: TypeId
	public get typeId(): TypeId {
		return this.#typeId
	}

	readonly #pathKeys: PathKeys

	get pathKeys() {
		return this.#pathKeys
	}

	get typeRootKey() {
		return NodeTypeId.getRootKey(this.typeId)
	}

	// computed properties

	/** The parsed elements of the ID as an array of strings. */
	get elements(): [RulesPackage, TypeId, ...PathKeys] {
		return [this.rulesPackage, this.typeId, ...this.pathKeys]
	}

	/**
	 * Returns a string representation of the ID.
	 */
	get id() {
		return this.elements.join(CONST.Sep)
	}

	/**
	 * Returns a string representation of the ID. Effectively an alias for {@link IdParser.id}
	 */
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
			TypeGuard.RecursiveCollectableType(this.typeId) ||
			TypeGuard.RecursiveCollectionType(this.typeId)
		)
	}

	/** Does this ID refer to a collectable object? */
	get isCollectable() {
		return TypeGuard.CollectableType(this.typeId)
	}

	/** Does this ID refer to a collection? */
	get isCollection() {
		return TypeGuard.CollectionType(this.typeId)
	}

	/** The regular expression that matches for a wildcard ID. */
	get matcher() {
		if (!(this.#matcher instanceof RegExp))
			this.#matcher = IdParser.#createMatcher(...this.elements)

		return this.#matcher
	}

	#matcher: null | RegExp = null

	/** Reset any cached matchers or paths. */
	#resetCachedProperties() {
		this.#matcher = null
		this.#globber = null
	}

	/** Lazy prop for this ID's Globber */
	#globber: null | ObjectGlobber = null

	/** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
	 * @internal
	 */
	toPath(): ObjectGlobber {
		if (this.#globber == null) {
			const path = IdParser.toPath(this)
			this.#globber = path
			return path as any
		}
		return this.#globber
	}

	/** Assign a string ID to a Datasworn node, and all eligible descendant nodes.
	 * @param node The Datasworn
	 * @param recursive Should IDs be assigned to descendant objects too? (default: true)
	 * @returns The mutated object.
	 */
	assignIdsIn(node: DataswornNode.ByType<TypeId>, recursive = true) {
		node._id = this.id
		return node
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.datasworn} or as an argument).
	 */
	get(tree?: (typeof IdParser)['datasworn']) {
		return IdParser.get(this, tree) as DataswornNode.ByType<TypeId>
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
	 */
	static get<T extends StringId.AnyId>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): DataswornNode.ByType<ExtractTypeId<T>>
	static get<T extends IdParser>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): ReturnType<T['get']>
	static get<T extends StringId.AnyId | IdParser>(
		id: T,
		tree = IdParser.datasworn
	) {
		const parsedId: IdParser =
			id instanceof IdParser ? id : (IdParser.fromString(id as any) as any)

		return parsedId.toPath().walk(tree as any)
	}

	/**
	 * Creates an IdParser from an {@link IdParser.Options} object. The appropriate subclass is inferred from the TypeId.
	 */
	static fromOptions<
		RulesPackage extends string,
		TypeId extends NodeTypeId.Collection.Recursive,
		CollectionAncestorKeys extends PathKeys.CollectionAncestorKeys,
		Key extends string
	>(
		options: IdParser.Options<
			RulesPackage,
			TypeId,
			[...CollectionAncestorKeys, Key]
		>
	): RecursiveCollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key>
	static fromOptions<
		RulesPackage extends string,
		TypeId extends NodeTypeId.Collection.NonRecursive,
		Key extends string
	>(
		options: IdParser.Options<RulesPackage, TypeId, [Key]>
	): NonRecursiveCollectionId<RulesPackage, TypeId, Key>
	static fromOptions<
		RulesPackage extends string,
		TypeId extends NodeTypeId.Collectable.Recursive,
		CollectableAncestorKeys extends PathKeys.CollectableAncestorKeys,
		Key extends string
	>(
		options: IdParser.Options<
			RulesPackage,
			TypeId,
			[...CollectableAncestorKeys, Key]
		>
	): RecursiveCollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key>
	static fromOptions<
		RulesPackage extends string,
		TypeId extends NodeTypeId.Collectable.NonRecursive,
		CollectionKey extends string,
		Key extends string
	>(
		options: IdParser.Options<RulesPackage, TypeId, [CollectionKey, Key]>
	): NonRecursiveCollectableId<RulesPackage, TypeId, CollectionKey, Key>
	static fromOptions<
		RulesPackage extends string,
		TypeId extends NodeTypeId.NonCollectable,
		Key extends string
	>(
		options: IdParser.Options<RulesPackage, TypeId, [Key]>
	): NonCollectableId<RulesPackage, TypeId, Key>
	static fromOptions(options: IdParser.Options): IdParser {
		this.#validateOptions(options)

		const { rulesPackage, typeId: type, pathKeys } = options

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
					...(pathKeys as PathKeys.CollectionPathKeys)
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

	// Private methods

	static #createMatcher(...elements: (string | number)[]) {
		return new RegExp(
			'^' + elements.map(IdParser.#getPatternFragment).join(CONST.Sep) + '$'
		)
	}

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
	// Public static  methods

	static toPath(options: IdParser): ObjectGlobber
	static toPath(options: IdParser.Options): ObjectGlobber
	static toPath(options: StringId.AnyId): ObjectGlobber
	static toPath(
		options: IdParser | IdParser.Options | StringId.AnyId
	): ObjectGlobber {
		const parsedId: IdParser =
			options instanceof IdParser
				? options
				: typeof options === 'string'
					? IdParser.fromString(options as any)
					: IdParser.fromOptions(options as any)

		const dotPathElements: (string | number)[] = []

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

	static readonly typeRootKeys = new Set(Object.values(NodeTypeId.RootKeys))

	/**
	 * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
	 * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
	 * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
	 */
	static assignIdsInRulesPackage<T extends DataswornSource.RulesPackage>(
		rulesPackage: T
	): Extract<Datasworn.RulesPackage, Pick<T, 'type'>> {
		for (const k of this.typeRootKeys) {
			const typeRoot = rulesPackage[k]
			if (typeRoot == null) continue
			for (const dictKey in typeRoot) {
				const topLevelNode = typeRoot[dictKey]
				const parser = IdParser.fromOptions({
					rulesPackage: rulesPackage._id,
					typeId: topLevelNode.type as any,
					pathKeys: [dictKey]
				})
				parser.assignIdsIn(topLevelNode, true)
			}
		}
    // @ts-expect-error
		return rulesPackage
	}

	/**
	 * Parses an ID string in to an IdParser options object.
	 * @throws If it can't parse the ID.
	 */
	static #parse(id: string): IdParser.Options {
		const [rulesPackage, type, ...pathKeys] = id.split(CONST.Sep) as [
			string, // RulesPackageId
			string, // NodeTypeId
			...string[] // PathKeys
		]

		const result: IdParser.Options = {
			rulesPackage,
			typeId: type as NodeTypeId.Any,
			pathKeys
		}

		try {
			this.#validateOptions(result)
		} catch (e) {
			throw new ParseError(id, e)
		}

		return result
	}

	/**
	 * Parses a Datasworn ID string into an IdParser of the appropriate subclass.
	 * @throws If it receives an invalid ID.
	 */
	static fromString<T extends StringId.NonRecursiveCollectableId>(
		id: T
	): NonRecursiveCollectableId.FromString<T>
	static fromString<T extends StringId.RecursiveCollectableId>(
		id: T
	): RecursiveCollectableId.FromString<T>
	static fromString<T extends StringId.NonRecursiveCollectionId>(
		id: T
	): NonRecursiveCollectionId.FromString<T>
	static fromString<T extends StringId.RecursiveCollectionId>(
		id: T
	): RecursiveCollectionId.FromString<T>
	static fromString<T extends StringId.NonCollectableId>(
		id: T
	): NonCollectableId.FromString<T>
	static fromString(id: string): IdParser {
		const options = IdParser.#parse(id)
		return IdParser.fromOptions(options as any) as any
	}

	/**
	 * @throws If it receives invalid IdParser options.
	 */
	static #validateOptions({
		rulesPackage,
		typeId: type,
		pathKeys
	}: IdParser.Options) {
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
	static #validateRulesPackage(key: unknown): key is StringId.RulesPackageId {
		return TypeGuard.RulesPackageId(key) || TypeGuard.Wildcard(key)
	}

	/**
	 * @throws If the path keys are invalid for the chosen ID format.
	 */
	static #validatePathKeys(
		pathKeys: unknown[],
		format: IdParser.FormatType
	): pathKeys is DataswornSource.DictKey[] {
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
	): key is DataswornSource.DictKey {
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
	static datasworn: Tree | null = null

	static readonly RulesPackagePattern = Pattern.RulesPackageElement
	static readonly DictKeyPattern = Pattern.DictKeyElement
	static readonly RecursiveDictKeyPattern = Pattern.RecursiveDictKeyElement
}

// derived classes

class NonCollectableId<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.NonCollectable = NodeTypeId.NonCollectable,
	Key extends string = string
> extends IdParser<RulesPackage, TypeId, [Key]> {
	constructor(rulesPackage: RulesPackage, typeId: TypeId, key: Key) {
		super({ rulesPackage, typeId: typeId, pathKeys: [key] })
	}
	// no override necessary for assignIdsIn
}

interface NonCollectableId<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.NonCollectable = NodeTypeId.NonCollectable,
	Key extends string = string
> extends IdParser<RulesPackage, TypeId, [Key]> {
	get id(): StringId.NonCollectableId<RulesPackage, TypeId, Key>
	get isCollectable(): false
	get elements(): [RulesPackage, TypeId, Key]
	get isCollection(): false
	get typeRootKey(): NodeTypeId.RootKey<TypeId>
	get collectionAncestorKeys(): []
	get pathKeys(): [Key]
	get key(): Key
}

namespace NonCollectableId {
	export type FromString<T extends StringId.NonCollectableId> =
		NonCollectableId<ExtractRulesPackage<T>, ExtractTypeId<T>, ExtractKey<T>>
}

abstract class CollectableId<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.Collectable.Any = NodeTypeId.Collectable.Any,
	CollectionPathKeys extends string[] = string[],
	Key extends string = string
> extends IdParser<RulesPackage, TypeId, [...CollectionPathKeys, Key]> {}
interface CollectableId<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.Collectable.Any = NodeTypeId.Collectable.Any,
	CollectionPathKeys extends string[] = string[],
	Key extends string = string
> extends IdParser<RulesPackage, TypeId, [...CollectionPathKeys, Key]> {
	get isCollectable(): true
	get elements(): [RulesPackage, TypeId, ...CollectionPathKeys, Key]
	get isCollection(): false
	get typeRootKey(): NodeTypeId.RootKey<TypeId>
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
	TypeId extends
		NodeTypeId.Collectable.NonRecursive = NodeTypeId.Collectable.NonRecursive,
	CollectionKey extends string = string,
	Key extends string = string
> extends CollectableId<RulesPackage, TypeId, [CollectionKey], Key> {
	constructor(
		rulesPackage: RulesPackage,
		typeId: TypeId,
		collectionKey: CollectionKey,
		key: Key
	) {
		super({
			rulesPackage,
			typeId,
			pathKeys: [collectionKey, key]
		})
	}
}
interface NonRecursiveCollectableId<
	RulesPackage extends string = string,
	TypeId extends
		NodeTypeId.Collectable.NonRecursive = NodeTypeId.Collectable.NonRecursive,
	CollectionKey extends string = string,
	Key extends string = string
> extends CollectableId<RulesPackage, TypeId, [CollectionKey], Key> {
	get id(): StringId.NonRecursiveCollectableId<
		RulesPackage,
		TypeId,
		CollectionKey,
		Key
	>
	get isRecursive(): false
}

namespace NonRecursiveCollectableId {
	export type FromString<T extends StringId.NonRecursiveCollectableId> =
		NonRecursiveCollectableId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractParentCollectionKey<T>,
			ExtractKey<T>
		>
}

class RecursiveCollectableId<
		RulesPackage extends string = string,
		TypeId extends
			NodeTypeId.Collectable.Recursive = NodeTypeId.Collectable.Recursive,
		CollectableAncestorKeys extends
			PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
		Key extends string = string
	>
	extends CollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key>
	implements RecursiveId
{
	constructor(
		rulesPackage: RulesPackage,
		typeId: TypeId,
		...pathKeys: [...CollectableAncestorKeys, Key]
	) {
		super({ rulesPackage, typeId, pathKeys })
	}

	get recursionDepth(): number {
		return this.collectionAncestorKeys.length
	}
}
interface RecursiveCollectableId<
	RulesPackage extends string = string,
	TypeId extends
		NodeTypeId.Collectable.Recursive = NodeTypeId.Collectable.Recursive,
	CollectableAncestorKeys extends
		PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
	Key extends string = string
> extends CollectableId<RulesPackage, TypeId, CollectableAncestorKeys, Key> {
	get id(): StringId.RecursiveCollectableId<
		RulesPackage,
		TypeId,
		CollectableAncestorKeys,
		Key
	>
	get isRecursive(): true

	get pathKeys(): [...CollectableAncestorKeys, Key]

	get collectionAncestorKeys(): CollectableAncestorKeys

	get elements(): [RulesPackage, TypeId, ...CollectableAncestorKeys, Key]
}

namespace RecursiveCollectableId {
	export type FromString<T extends StringId.RecursiveCollectableId> =
		RecursiveCollectableId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractAncestorKeys<T>,
			ExtractKey<T>
		>
}

abstract class CollectionId<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.Collection.Any = NodeTypeId.Collection.Any,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> extends IdParser<RulesPackage, TypeId, [...CollectionAncestorKeys, Key]> {
	constructor(
		rulesPackage: RulesPackage,
		typeId: TypeId,
		...pathKeys: [...CollectionAncestorKeys, Key]
	) {
		super({ rulesPackage, typeId, pathKeys })
	}

	createChild<ChildKey extends string>(
		key: ChildKey
	): CollectableId<
		RulesPackage,
		NodeTypeId.CollectableOf<TypeId>,
		[...CollectionAncestorKeys, Key],
		ChildKey
	> {
		// @ts-expect-error
		return IdParser.fromOptions({
			rulesPackage: this.rulesPackage,
			// @ts-expect-error

			typeId: NodeTypeId.getCollectableOf(this.typeId),
			pathKeys: [...this.pathKeys, key]
		})
	}

	override assignIdsIn(node: DataswornNode.ByType<TypeId>, recursive = true) {
		if (recursive)
			for (const childKey in node.contents) {
				const childNode = node.contents[childKey]
				if (childNode == null) continue
				const childParser = this.createChild(childKey)
				childNode._id = childParser.id
			}
		return super.assignIdsIn(node, recursive)
	}
}
interface CollectionId<
	RulesPackage extends string = string,
	TypeId extends NodeTypeId.Collection.Any = NodeTypeId.Collection.Any,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> extends IdParser<RulesPackage, TypeId, [...CollectionAncestorKeys, Key]> {
	get elements(): [RulesPackage, TypeId, ...CollectionAncestorKeys, Key]
	get isCollectable(): false
	get isCollection(): true
	get typeRootKey(): NodeTypeId.RootKey<TypeId>
	get collectionAncestorKeys(): CollectionAncestorKeys
	get pathKeys(): [...CollectionAncestorKeys, Key]
	get key(): Key
}

class RecursiveCollectionId<
		RulesPackage extends string = string,
		TypeId extends
			NodeTypeId.Collection.Recursive = NodeTypeId.Collection.Recursive,
		CollectionAncestorKeys extends
			PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
		Key extends string = string
	>
	extends CollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key>
	implements RecursiveId
{
	createCollectionChild<ChildKey extends string>(
		key: ChildKey
	): RecursiveCollectionId.ChildCollectionOf<this, ChildKey> {
		if (this.pathKeys.length >= CONST.RECURSIVE_PATH_ELEMENTS_MAX)
			throw new ParseError(
				this.id,
				`Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${CONST.RECURSIVE_PATH_ELEMENTS_MAX})`
			)

		return new RecursiveCollectionId(
			this.rulesPackage,
			this.typeId,
			...this.pathKeys,
			key
		) as any
	}

	override assignIdsIn(node: DataswornNode.ByType<TypeId>, recursive = true) {
		if (recursive && CONST.CollectionsKey in node)
			for (const childKey in node.collections) {
				const childCollection = node.collections[childKey]
				if (childCollection == null) continue
				const childParser = this.createCollectionChild(childKey)
				childParser.assignIdsIn(childCollection as any, recursive)
			}
		return super.assignIdsIn(node, recursive)
	}

	/**
	 * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
	 */
	getParentCollection(): RecursiveCollectionId.ParentCollectionOf<this> {
		if (this.collectionAncestorKeys.length === 0)
			throw new ParseError(
				this.id,
				`Can't generate a parent ID because this ID has no ancestors.`
			)

		return new RecursiveCollectionId(
			this.rulesPackage,
			this.typeId,
			...(this.collectionAncestorKeys as any)
		) as any
	}

	get recursionDepth(): number {
		return this.pathKeys.length
	}
}
interface RecursiveCollectionId<
	RulesPackage extends string = string,
	TypeId extends
		NodeTypeId.Collection.Recursive = NodeTypeId.Collection.Recursive,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> extends CollectionId<RulesPackage, TypeId, CollectionAncestorKeys, Key> {
	get pathKeys(): [...CollectionAncestorKeys, Key]

	get id(): StringId.RecursiveCollectionId<
		RulesPackage,
		TypeId,
		CollectionAncestorKeys,
		Key
	>
	get isRecursive(): true
	get collectionAncestorKeys(): CollectionAncestorKeys

	get elements(): [RulesPackage, TypeId, ...CollectionAncestorKeys, Key]
	createChild<ChildKey extends string>(
		key: ChildKey
	): RecursiveCollectableId<
		RulesPackage,
		NodeTypeId.CollectableOf<TypeId>,
		[...CollectionAncestorKeys, Key],
		ChildKey
	>
	// {
	// 	return new RecursiveCollectableId(
	// 		this.rulesPackage,
	// 		NodeTypeId.getCollectedBy(this.typeId),
	// 		...this.collectionAncestorKeys,
	// 		this.key,
	// 		key
	// 	)
	// }
}

namespace RecursiveCollectionId {
	export type FromString<T extends StringId.RecursiveCollectionId> =
		RecursiveCollectionId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractAncestorKeys<T>,
			ExtractKey<T>
		>
	export type ChildOf<
		T extends RecursiveCollectionId,
		K extends string = string
	> = RecursiveCollectableId<
		T['rulesPackage'],
		NodeTypeId.CollectableOf<T['typeId']>,
		T['pathKeys'],
		K
	>
	export type ChildCollectionOf<
		T extends RecursiveCollectionId,
		K extends string = string
	> = T['pathKeys'] extends PathKeys.CollectionAncestorKeys
		? RecursiveCollectionId<T['rulesPackage'], T['typeId'], T['pathKeys'], K>
		: never

	export type ParentCollectionOf<T extends RecursiveCollectionId> =
		T['collectionAncestorKeys'] extends [infer K extends string]
			? RecursiveCollectionId<T['rulesPackage'], T['typeId'], [], K>
			: T['collectionAncestorKeys'] extends [
						infer U extends string,
						infer K extends string
				  ]
				? RecursiveCollectionId<T['rulesPackage'], T['typeId'], [U], K>
				: T['collectionAncestorKeys'] extends [
							...infer U extends PathKeys.CollectionAncestorKeys,
							infer K extends string
					  ]
					? RecursiveCollectionId<T['rulesPackage'], T['typeId'], U, K>
					: never
}

class NonRecursiveCollectionId<
	RulesPackage extends string = string,
	TypeId extends
		NodeTypeId.Collection.NonRecursive = NodeTypeId.Collection.NonRecursive,
	Key extends string = string
> extends CollectionId<RulesPackage, TypeId, [], Key> {}
interface NonRecursiveCollectionId<
	RulesPackage extends string = string,
	TypeId extends
		NodeTypeId.Collection.NonRecursive = NodeTypeId.Collection.NonRecursive,
	Key extends string = string
> extends CollectionId<RulesPackage, TypeId, [], Key> {
	get id(): StringId.NonRecursiveCollectionId<RulesPackage, TypeId, Key>
	get isRecursive(): false
	get pathKeys(): [Key]
	get collectionAncestorKeys(): []
	get elements(): [RulesPackage, TypeId, Key]

	createChild<ChildKey extends string>(
		key: ChildKey
	): NonRecursiveCollectableId<
		RulesPackage,
		NodeTypeId.CollectableOf<TypeId>,
		Key,
		ChildKey
	>
}

namespace NonRecursiveCollectionId {
	export type FromString<T extends StringId.NonRecursiveCollectionId> =
		NonRecursiveCollectionId<
			ExtractRulesPackage<T>,
			ExtractTypeId<T>,
			ExtractKey<T>
		>
	export type ChildOf<
		T extends NonRecursiveCollectionId,
		K extends string
	> = NonRecursiveCollectableId<
		T['rulesPackage'],
		NodeTypeId.CollectableOf<T['typeId']>,
		T['key'],
		K
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
