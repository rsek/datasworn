import CONST from './IdElements/CONST.js'
import TypeGuard from './IdElements/TypeGuard.js'
import TypeId from './IdElements/TypeId.js'
import GlobberPath from './ObjectGlobber.js'
import type * as StringId from './StringId.js'
import type {
	ExtractTypeId,
	ExtractAncestorKeys,
	ExtractKey,
	ExtractRulesPackage,
	ExtractPrimaryAncestorKeys
} from './Utils/Id.js'
import type { Datasworn, DataswornSource } from './index.js'

import { Pattern, type PathKeys } from './IdElements/index.js'
import { ParseError } from './Errors.js'
import type TypeNode from './TypeNode.js'
import type { Tree } from './Tree.js'
import type { Join } from './Utils/String.js'

abstract class IdParser<
	TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts,
	PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
		length: TypeIds['length']
	}
> implements IdParser.Options<TypeIds, PathSegments>
{
	#pathSegments: PathSegments
	#typeIds: TypeIds

	/**
	 * The object used for log messages.
	 * @default console
	 */
	static logger = console

	get typeIds() {
		return this.#typeIds
	}

	set typeIds(value) {
		IdParser.#validateTypeIds(value)

		this.#typeIds = value
	}

	get pathSegments() {
		return this.#pathSegments
	}

	set pathSegments(value) {
		const formatType = IdParser.#getIdFormat(this.primaryTypeId)

		IdParser.#validatePathSegments(formatType, value)

		if (this.typeIds.length !== value.length)
			throw new Error("The length of typeIds and pathSegments does't match.")

		this.#pathSegments = value
	}

	constructor(options: IdParser.Options<TypeIds, PathSegments>) {
		// prepare the ID so we can throw errors with it if necessary
		const id = IdParser.#toString(options)

		const { typeIds, pathSegments } = options

		const errors = []

		try {
			this.typeIds = typeIds
			this.pathSegments = pathSegments
		} catch (e) {
			errors.push(e)
		}
		if (errors.length > 0) throw new ParseError(id, errors.join('\n'))
	}

	createEmbeddedId<
		TypeId extends TypeId.EmbeddableTypes,
		Key extends string | number
	>(typeId: TypeId, key: Key) {
		// IdParser.logger.debug(`[createdEmbeddedId] ${this.id} > ${typeId}, ${key}`)
		return new EmbeddedId<this, TypeId, Key>(this, typeId, key.toString())
	}

	static #validateTypeIds(typeIds: unknown) {
		if (
			!(
				Array.isArray(typeIds) &&
				typeIds.every((str) => typeof str === 'string')
			)
		)
			throw new Error(
				`Expected an array of strings but got ${JSON.stringify(typeIds)}`
			)

		const [primaryTypeId, ...embeddedTypeIds] = typeIds

		if (!TypeGuard.AnyPrimaryType(primaryTypeId))
			throw new Error(
				`Expected a primary type but got ${JSON.stringify(primaryTypeId)}`
			)

		for (const typeId of embeddedTypeIds)
			if (
				!(
					TypeGuard.EmbedOnlyType(typeId) ||
					TypeGuard.EmbeddablePrimaryType(typeId)
				)
			)
				throw new Error(
					`Expected an embeddable type but got ${JSON.stringify(typeId)}`
				)

		return true
	}

	static #toString({ typeIds, pathSegments }: IdParser.Options) {
		const leftSide = typeIds.join(CONST.PathTypeSep)
		const rightSide = pathSegments.join(CONST.PathTypeSep)
		return leftSide + CONST.PrefixSep + rightSide
	}

	static #getIdFormat(value: string) {
		let primaryPathFormat: IdParser.FormatType
		switch (true) {
			case TypeGuard.CollectionType(value):
				primaryPathFormat = 'collection'
				break
			case TypeGuard.CollectableType(value):
				primaryPathFormat = 'collectable'
				break
			case TypeGuard.NonCollectableType(value):
				primaryPathFormat = 'non_collectable'
				break
			default:
				throw new Error(`Expected primary TypeId but got ${value}`)
		}
		return primaryPathFormat
	}

	static #validatePathSegments(
		formatType: IdParser.FormatType,
		pathSegments: unknown
	): pathSegments is string[] {
		if (
			!(
				Array.isArray(pathSegments) &&
				pathSegments.every((str) => typeof str === 'string')
			)
		)
			throw new Error(
				`Expected an array of strings, but got ${JSON.stringify(pathSegments)}`
			)

		const [primaryPath, ...embeddedPaths] = pathSegments as string[]
		const [rulesPackage, ...primaryPathKeys] = primaryPath.split(
			CONST.PathKeySep
		)
		if (!IdParser.#validateRulesPackage(rulesPackage))
			throw new Error(
				`Expected a RulesPackageId, but got ${JSON.stringify(rulesPackage)}`
			)

		for (const key of primaryPathKeys)
			if (!IdParser.#validateDictKey(key))
				throw new Error(
					`Expected a DictKey or wildcard, but got ${JSON.stringify(key)}`
				)

		for (const embeddedPath of embeddedPaths) {
			const pathParts = embeddedPath.split(CONST.PathKeySep)
			for (const pathPart of pathParts)
				if (
					!(
						IdParser.#validateDictKey(pathPart) ||
						IdParser.#validateIndexKey(pathPart)
					)
				)
					throw new Error(
						`Expected a DictKey, array index, or wildcard, but got ${JSON.stringify(pathPart)}`
					)
		}

		IdParser.#validatePrimaryPathKeys(formatType, primaryPathKeys)

		return true
	}

	static #validateIndexKey(value: unknown) {
		return TypeGuard.Wildcard(value) || TypeGuard.IndexKey(value as string)
	}

	/**
	 * Returns a string representation of the ID.
	 */
	get id() {
		return IdParser.#toString(this) as StringId.IdBase<TypeIds, PathSegments>
	}

	toString() {
		return this.id
	}

	// ID parts

	get primaryTypeId() {
		return this.typeIds[0]
	}

	get primaryPath() {
		return this.pathSegments[0]
	}

	get primaryPathElements() {
		return this.primaryPath.split(CONST.PathKeySep)
	}

	get rulesPackage() {
		return this.primaryPathElements[0]
	}

	get primaryDictKeyElements() {
		// omit rules package, which is the first
		const [_rulesPackage, ...keyElements] = this.primaryPathElements
		return keyElements
	}

	get fullTypeId() {
		return this.typeIds.join(CONST.PathTypeSep) as Join<
			TypeIds,
			CONST.PathTypeSep
		>
	}

	get fullPath() {
		return this.pathSegments.join(CONST.PathTypeSep) as Join<
			PathSegments,
			CONST.PathTypeSep
		>
	}

	get targetTypeId() {
		return this.typeIds.at(-1)
	}

	get lastProperty() {
		return TypeId.getRootKey(this.fullTypeId as TypeId.AnyPrimary)
	}

	/** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
	get isWildcard() {
		return this.id.includes(CONST.WildcardString)
	}

	/** May this ID contain recursive elements in its path? */
	get isRecursive() {
		return this.isCollectable || this.isCollection
	}

	/** Does this ID include a collectable object in its path? */
	get isCollectable() {
		return TypeGuard.CollectableType(this.primaryTypeId)
	}

	/** Does this ID include a collection object in its path? */
	get isCollection() {
		return TypeGuard.CollectionType(this.primaryTypeId)
	}

	/** Assign a string ID to a Datasworn node, and all eligible descendant nodes.
	 * @param node The Datasworn
	 * @param recursive Should IDs be assigned to descendant objects too? (default: true)
	 * @returns The mutated object.
	 */
	assignIdsIn(
		node: TypeNode.Any,
		recursive = true,
		index?: Map<string, TypeNode.Any>
	): TypeNode.Any {
		if (typeof node._id === 'string')
			IdParser.logger.warn(
				`Can't assign <${this.id}>, node already has <${node._id}>`
			)
		else {
			node._id = this.id
			// IdParser.logger.debug(
			// 	`[assignIdsIn] Assigned ${this.constructor.name} @ <${this.id}>`
			// )
		}

		if (recursive) {
			const embeddedTypes = TypeId.getEmbeddableTypes(
				this.fullTypeId as TypeId.Any
			)

			for (const nextTypeId of embeddedTypes) {
				const property = TypeId.getEmbeddedPropertyKey(nextTypeId)
				if (!(property in node)) continue
				const childNodes = node[property] as
					| Record<string, TypeNode.AnyEmbedded>
					| Array<TypeNode.AnyEmbedded>
				if (childNodes == null) continue

				if (Array.isArray(childNodes)) {
					this.#assignIdsInArray(childNodes, nextTypeId, recursive, index)
				} else {
					this.#assignIdsInDictionary(childNodes, nextTypeId, recursive, index)
				}
			}
		}

		if (index instanceof Map) index.set(this.id, node)

		return node
	}

	#assignIdsInDictionary(
		childNodes: Record<string, TypeNode.AnyEmbedded>,
		nextTypeId: TypeId.EmbeddableTypes,
		recursive?: boolean,
		index?: Map<string, TypeNode.Any>
	) {
		// IdParser.logger.debug('[#assignIdsInDictionary]')
		for (const k in childNodes) {
			const childNode = childNodes[k]
			if (childNode == null) continue
			const childParser = this.createEmbeddedId(nextTypeId, k)
			childParser.assignIdsIn(childNode, recursive, index)
		}
	}

	#assignIdsInArray(
		childNodes: TypeNode.AnyEmbedded[],
		nextTypeId: TypeId.EmbeddableTypes,
		recursive?: boolean,
		index?: Map<string, TypeNode.Any>
	) {
		// IdParser.logger.debug('[#assignIdsInArray]')
		for (let i = 0; i < childNodes.length; i++) {
			const childNode = childNodes[i]
			const childParser = this.createEmbeddedId(nextTypeId, i)
			childParser.assignIdsIn(childNode, recursive, index)
		}
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.datasworn} or as an argument).
	 */
	get(tree?: (typeof IdParser)['datasworn']) {
		return IdParser.get(this, tree) as TypeNode.Any
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in IdParser.datasworn or as an argument).
	 */
	static get<T extends StringId.AnyId>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): TypeNode.ByType<ExtractTypeId<T>>
	static get<T extends IdParser>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): ReturnType<T['get']>
	static get<T extends StringId.AnyId | IdParser>(
		id: T,
		tree = IdParser.datasworn
	) {
		const parsedId: IdParser =
			id instanceof IdParser ? id : (IdParser.parse(id as any) as any)

		return parsedId.toGlobberPath().walk(tree)
	}

	// Public static  methods

	/** Lazy prop for this ID's Globber */
	#globberPath: null | GlobberPath = null

	/** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
	 * @internal
	 */
	toGlobberPath(): GlobberPath {
		if (this.#globberPath instanceof GlobberPath) return this.#globberPath

		const dotPath: (string | number)[] = []

		const [rulesPackage, trunkKey, ...branchKeys] = this.primaryPathElements
		const [primaryTypeId, ...embeddedTypeIds] = this.typeIds
		const [primaryPath, ...embeddedPaths] = this.pathSegments

		// primary path
		// "starforged"
		dotPath.push(rulesPackage)
		//  "starforged.oracles"
		dotPath.push(TypeId.getRootKey(primaryTypeId as TypeId.AnyPrimary))

		//  "starforged.oracles.core"
		dotPath.push(trunkKey)

		for (let i = 0; i < branchKeys.length; i++) {
			const currentKey = branchKeys[i]
			const isLastKey = i === branchKeys.length - 1
			const dictionaryProperty =
				this.isCollectable && isLastKey
					? CONST.ContentsKey
					: CONST.CollectionsKey
			dotPath.push(dictionaryProperty, currentKey)
		}

		for (let i = 0; i < embeddedTypeIds.length; i++) {
			const typeId = embeddedTypeIds[i]
			const path = embeddedPaths[i]
			const property = TypeId.getEmbeddedPropertyKey(
				typeId as TypeId.EmbeddableTypes
			)

			dotPath.push(property, path)
		}

		this.#globberPath = new GlobberPath(...dotPath) as any

		return this.#globberPath
	}

	/**
	 * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
	 * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
	 * @param index If provided, nodes that receive IDs will be indexed in the map (with their ID as the key).
	 * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
	 */
	static assignIdsInRulesPackage<T extends DataswornSource.RulesPackage>(
		rulesPackage: T,
		index?: Map<string, TypeNode.Any>
	): Extract<Datasworn.RulesPackage, Pick<T, 'type'>> {
		const errorMessages: string[] = []
		for (const typeId in TypeId.RootKeys) {
			const typeRootKey = TypeId.getRootKey(typeId as TypeId.AnyPrimary)
			const typeRoot = rulesPackage[typeRootKey]
			if (typeRoot == null) continue

			for (const dictKey in typeRoot) {
				const trunkNode = typeRoot[dictKey]
				if (trunkNode == null) continue

				const id = `${typeId}${CONST.PrefixSep}${rulesPackage._id}${CONST.PathKeySep}${dictKey}`

				let parser: CollectionId | NonCollectableId
				try {
					switch (true) {
						case TypeGuard.CollectionType(typeId):
							parser = new CollectionId(typeId, rulesPackage._id, dictKey)
							parser.assignIdsIn(
								trunkNode as TypeNode.ByType<typeof typeId>,
								true,
								index
							)
							break
						case TypeGuard.NonCollectableType(typeId):
							parser = new NonCollectableId(typeId, rulesPackage._id, dictKey)
							parser.assignIdsIn(
								trunkNode as TypeNode.ByType<typeof typeId>,
								true,
								index
							)
							break
						default:
							break
					}
				} catch (e) {
					errorMessages.push(`Failed to create ID within <${id}>. ${String(e)}`)
				}
			}
		}
		if (errorMessages.length > 0) throw new Error(errorMessages.join('\n'))

		// @ts-expect-error
		return rulesPackage
	}

	/**
	 * Parses an ID string in to an IdParser options object without attempting to validate it.
	 */
	static #parseOptions(id: string): IdParser.Options {
		const [leftSide, rightSide] = id.split(CONST.PrefixSep)

		const typeIds = leftSide.split(CONST.PathTypeSep)
		const pathSegments = rightSide.split(CONST.PathTypeSep)

		return {
			typeIds,
			pathSegments
		}
	}

	static #getClassForPrimaryTypeId<T extends TypeId.NonCollectable>(
		typeId: T
	): typeof NonCollectableId
	static #getClassForPrimaryTypeId<T extends TypeId.Collection>(
		typeId: T
	): typeof CollectionId
	static #getClassForPrimaryTypeId<T extends TypeId.Collectable>(
		typeId: T
	): typeof CollectableId
	static #getClassForPrimaryTypeId(
		typeId: TypeId.AnyPrimary
	): typeof NonCollectableId | typeof CollectionId | typeof CollectableId {
		switch (true) {
			case TypeGuard.CollectionType(typeId):
				return CollectionId
			case TypeGuard.CollectableType(typeId):
				return CollectableId
			case TypeGuard.NonCollectableType(typeId):
				return NonCollectableId
			default:
				throw new Error(
					`Expected TypeId.AnyPrimary, but got ${JSON.stringify(typeId)}`
				)
		}
	}

	static parse<T extends StringId.NonCollectableId>(id: T): NonCollectableId
	static parse<T extends StringId.CollectableId>(id: T): CollectableId
	static parse<T extends StringId.CollectionId>(id: T): CollectionId
	static parse<T extends StringId.EmbeddedId>(id: T): EmbeddedId
	static parse(
		id: string
	): CollectionId | CollectableId | NonCollectableId | EmbeddedId {
		const { typeIds, pathSegments } = this.#parseOptions(id)
		const [primaryTypeId, ...embeddedTypeIds] = typeIds as [
			TypeId.AnyPrimary,
			...TypeId.EmbeddableTypes[]
		]
		const [primaryPath, ...embeddedPaths] = pathSegments
		const [rulesPackage, ...pathKeys] = primaryPath.split(CONST.PathKeySep)

		const Ctor = IdParser.#getClassForPrimaryTypeId(primaryTypeId)
		// @ts-expect-error
		const base = new Ctor(primaryTypeId, rulesPackage, ...pathKeys)

		if (embeddedTypeIds.length === 0) return base

		let lastParser = base as
			| CollectionId
			| CollectableId
			| NonCollectableId
			| EmbeddedId

		for (let i = 0; i < embeddedTypeIds.length; i++) {
			const typeId = embeddedTypeIds[i] as TypeId.EmbeddableTypes
			const pathKey = embeddedPaths[i]
			lastParser = lastParser.createEmbeddedId(typeId, pathKey)
		}

		return lastParser
	}

	// Static private methods

	static #validateRulesPackage(key: unknown): key is StringId.RulesPackageId {
		return TypeGuard.RulesPackageId(key) || TypeGuard.Wildcard(key)
	}

	/**
	 * @throws If the path keys are invalid for the chosen ID format.
	 */
	static #validatePrimaryPathKeys(
		format: IdParser.FormatType,
		pathKeys: unknown[]
	): pathKeys is DataswornSource.DictKey[] {
		let min: number
		let max: number
		let isRecursive: boolean

		switch (format) {
			// collectables get an additional key -- this is the key of the collectable itself
			case 'collectable':
				min = CONST.RECURSIVE_PATH_ELEMENTS_MIN + 1
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX + 1
				isRecursive = true
				break
			case 'collection':
				min = CONST.RECURSIVE_PATH_ELEMENTS_MIN
				max = CONST.RECURSIVE_PATH_ELEMENTS_MAX
				isRecursive = true
				break
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

		if (TypeGuard.Globstar(pathKeys.at(-1)) && format !== 'collection')
			throw new Error(
				`Received a recursive wildcard as a key for a non-recursive collection type`
			)

		return true
	}

	static #validateDictKey(key: unknown): key is DataswornSource.DictKey {
		return TypeGuard.AnyWildcard(key) || TypeGuard.DictKey(key)
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
	static readonly RecursiveDictKeyPattern = Pattern.RecursiveDictKeysElement
}

namespace IdParser {
	export type FormatType = 'collectable' | 'collection' | 'non_collectable'

	export type Options<
		TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts,
		PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
			length: TypeIds['length']
		}
	> = {
		typeIds: TypeIds
		pathSegments: PathSegments
	}
}

class NonCollectableId<
	TypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends string = string,
	Key extends string = string
> extends IdParser<[TypeId], [Join<[RulesPackage, Key]>]> {
	constructor(typeId: TypeId, rulesPackage: RulesPackage, key: Key) {
		const pathSegment = [rulesPackage, key].join(CONST.PathKeySep) as Join<
			[RulesPackage, Key]
		>
		super({
			typeIds: [typeId],
			pathSegments: [pathSegment]
		})
	}
}

interface NonCollectableId<
	TypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends string = string,
	Key extends string = string
> extends IdParser<[TypeId], [`${RulesPackage}${CONST.PathKeySep}${Key}`]> {
	get id(): StringId.NonCollectableId<TypeId, RulesPackage, Key>
}
namespace NonCollectableId {
	export type FromString<T extends StringId.NonCollectableId> =
		NonCollectableId<ExtractTypeId<T>, ExtractRulesPackage<T>, ExtractKey<T>>
}

interface RecursiveId extends IdParser {
	/** The current collection recursion depth. */
	get recursionDepth(): number
	get isRecursive(): true
}

class CollectableId<
		TypeId extends TypeId.Collectable = TypeId.Collectable,
		RulesPackage extends string = string,
		CollectableAncestorKeys extends
			PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
		Key extends string = string
	>
	extends IdParser<
		[TypeId],
		[Join<[RulesPackage, ...CollectableAncestorKeys, Key]>]
	>
	implements RecursiveId
{
	constructor(
		typeId: TypeId,
		rulesPackage: RulesPackage,
		...pathKeys: [...CollectableAncestorKeys, Key]
	) {
		const pathSegment = [rulesPackage, ...pathKeys].join(
			CONST.PathKeySep
		) as Join<[RulesPackage, ...CollectableAncestorKeys, Key]>
		super({
			typeIds: [typeId],
			pathSegments: [pathSegment]
		})
	}

	get recursionDepth(): number {
		// don't count this id's own key -- only collection depth is counted
		return this.primaryDictKeyElements.length - 1
	}
}

interface CollectableId<
	TypeId extends TypeId.Collectable = TypeId.Collectable,
	RulesPackage extends string = string,
	CollectableAncestorKeys extends
		PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
	Key extends string = string
> extends IdParser<
			[TypeId],
			[Join<[RulesPackage, ...CollectableAncestorKeys, Key]>]
		>,
		RecursiveId {
	// declaring these so TS doesn't have to compute them

	get id(): StringId.CollectableId<
		TypeId,
		RulesPackage,
		CollectableAncestorKeys,
		Key
	>

	get primaryTypeId(): TypeId
	get primaryPathElements(): [RulesPackage, ...CollectableAncestorKeys, Key]
	get primaryDictKeyElements(): [...CollectableAncestorKeys, Key]
	get isRecursive(): true
	get isCollection(): false
	get isCollectable(): true
}
namespace CollectableId {
	export type FromString<T extends StringId.CollectableId> = CollectableId<
		ExtractTypeId<T>,
		ExtractRulesPackage<T>,
		ExtractPrimaryAncestorKeys<T>,
		ExtractKey<T>
	>
}

class CollectionId<
		TypeId extends TypeId.Collection = TypeId.Collection,
		RulesPackage extends string = string,
		CollectionAncestorKeys extends
			PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
		Key extends string = string
	>
	extends IdParser<
		[TypeId],
		[Join<[RulesPackage, ...CollectionAncestorKeys, Key]>]
	>
	implements RecursiveId
{
	constructor(
		typeId: TypeId,
		rulesPackage: RulesPackage,
		...pathKeys: [...CollectionAncestorKeys, Key]
	) {
		const pathSegment = [rulesPackage, ...pathKeys].join(
			CONST.PathKeySep
		) as Join<[RulesPackage, ...CollectionAncestorKeys, Key]>
		super({
			typeIds: [typeId],
			pathSegments: [pathSegment]
		})
	}

	get recursionDepth() {
		return this.primaryDictKeyElements.length
	}

	get collectionAncestorKeys() {
		// everything but the last key, which belongs to the ID target
		return this.primaryDictKeyElements.slice(0, -1) as CollectionAncestorKeys
	}

	createChild<ChildKey extends string>(
		key: ChildKey
	): CollectableId<
		TypeId.CollectableOf<TypeId>,
		RulesPackage,
		[...CollectionAncestorKeys, Key],
		ChildKey
	> {
		return new CollectableId<
			TypeId.CollectableOf<TypeId>,
			RulesPackage,
			[...CollectionAncestorKeys, Key],
			ChildKey
		>(
			TypeId.getCollectableOf(this.primaryTypeId),
			...this.primaryPathElements,
			key
		)
	}

	override assignIdsIn<T extends TypeNode.ByType<TypeId>>(
		node: T,
		recursive = true,
		index?: Map<string, TypeNode.Any>
	): T {
		// run this up front so the log ordering is more intuitive
		const base = super.assignIdsIn(node, recursive, index)

		if (recursive) {
			if (CONST.ContentsKey in node && node[CONST.ContentsKey] != null)
				for (const childKey in node[CONST.ContentsKey]) {
					const childNode = node[CONST.ContentsKey][childKey]
					if (childNode == null) continue
					const childParser = this.createChild(childKey)
					childParser.assignIdsIn(childNode as any, recursive, index)
				}
			if (CONST.CollectionsKey in node && node[CONST.CollectionsKey] != null)
				for (const childKey in node[CONST.CollectionsKey]) {
					const childCollection = node[CONST.CollectionsKey][childKey]
					if (childCollection == null) continue
					const childParser = this.createCollectionChild(childKey)
					childParser.assignIdsIn(childCollection as any, recursive, index)
				}
		}

		return base as T
	}

	/**
	 * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
	 */
	getParentCollection(): CollectionId.ParentCollectionOf<this> {
		if (this.collectionAncestorKeys.length === 0)
			throw new ParseError(
				this.id,
				`Can't generate a parent ID because this ID has no ancestors.`
			)

		return new CollectionId(
			this.primaryTypeId,
			this.rulesPackage,
			...(this.collectionAncestorKeys as any)
		) as any
	}

	/**
	 * @throws If a child collection ID can't be created because the maximum recursion depth has been reached.
	 * @see {@link CONST.RECURSIVE_PATH_ELEMENTS_MAX}
	 */
	createCollectionChild<ChildKey extends string>(
		key: ChildKey
	): CollectionId.ChildCollectionOf<this, ChildKey> {
		if (this.recursionDepth >= CONST.RECURSIVE_PATH_ELEMENTS_MAX)
			throw new ParseError(
				this.id,
				`Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${CONST.RECURSIVE_PATH_ELEMENTS_MAX})`
			)

		return new CollectionId(
			this.primaryTypeId,
			this.rulesPackage,
			...this.primaryDictKeyElements,
			key
		) as any
	}
}

interface CollectionId<
	TypeId extends TypeId.Collection = TypeId.Collection,
	RulesPackage extends string = string,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> extends IdParser<
			[TypeId],
			[Join<[RulesPackage, ...CollectionAncestorKeys, Key]>]
		>,
		RecursiveId {
	get isCollectable(): false
	get isCollection(): true
	get isRecursive(): true
	get id(): StringId.CollectionId<
		TypeId,
		RulesPackage,
		CollectionAncestorKeys,
		Key
	>
	get primaryTypeId(): TypeId
	get primaryPathElements(): [RulesPackage, ...CollectionAncestorKeys, Key]
	get primaryDictKeyElements(): [...CollectionAncestorKeys, Key]
}

namespace CollectionId {
	export type FromString<T extends StringId.CollectionId> = CollectionId<
		ExtractTypeId<T>,
		ExtractRulesPackage<T>,
		ExtractAncestorKeys<T>,
		ExtractKey<T>
	>
	export type ChildOf<
		T extends CollectionId,
		K extends string = string
	> = CollectableId<
		TypeId.CollectableOf<T['primaryTypeId']>,
		T['rulesPackage'],
		T['primaryDictKeyElements'],
		K
	>
	export type ChildCollectionOf<
		T extends CollectionId,
		K extends string = string
	> = T['primaryDictKeyElements'] extends PathKeys.CollectionAncestorKeys
		? CollectionId<
				T['primaryTypeId'],
				T['rulesPackage'],
				T['primaryDictKeyElements'],
				K
			>
		: never

	export type ParentCollectionOf<T extends CollectionId> =
		T['collectionAncestorKeys'] extends [infer K extends string]
			? CollectionId<T['primaryTypeId'], T['rulesPackage'], [], K>
			: T['collectionAncestorKeys'] extends [
						infer U extends string,
						infer K extends string
				  ]
				? CollectionId<T['primaryTypeId'], T['rulesPackage'], [U], K>
				: T['collectionAncestorKeys'] extends [
							...infer U extends PathKeys.CollectionAncestorKeys,
							infer K extends string
					  ]
					? CollectionId<T['primaryTypeId'], T['rulesPackage'], U, K>
					: never
}

class EmbeddedId<
	Parent extends IdParser.Options = IdParser.Options,
	TypeId extends TypeId.EmbeddableTypes = TypeId.EmbeddableTypes,
	Key extends string | number = string | number
> extends IdParser {
	constructor(parent: Parent, typeId: TypeId, key: string)
	constructor(parent: Parent, typeId: TypeId, index: number)
	constructor(parent: Parent, typeId: TypeId, key: Key) {
		const options = {
			typeIds: [...parent.typeIds, typeId],
			pathSegments: [...parent.pathSegments, key.toString()]
		} as const satisfies IdParser.Options

		super(options)
	}
}
interface EmbeddedId<
	Parent extends IdParser.Options = IdParser.Options,
	TypeId extends TypeId.EmbeddableTypes = TypeId.EmbeddableTypes,
	Key extends string | number = string | number
> extends IdParser {}

export { IdParser, NonCollectableId, CollectableId, EmbeddedId, CollectionId }

// const f = new CollectableId('asset', 'starforged', 'path', 'archer')

// const ff = f.createEmbeddedId('ability', 0)

// const fff = ff.createEmbeddedId('move', 'craft_arrows')

// IdParser.logger.log(f.id, f.toGlobberPath())
// IdParser.logger.log(ff.id, ff.toGlobberPath())
// IdParser.logger.log(fff.id, fff.toGlobberPath())
