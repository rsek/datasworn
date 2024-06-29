import CONST from './IdElements/CONST.js'
import TypeGuard from './IdElements/TypeGuard.js'
import TypeId from './IdElements/TypeId.js'
import type * as StringId from './StringId.js'
import type { ExtractTypeId } from './Utils/Id.js'
import { type Datasworn, type DataswornSource } from './index.js'

import { ParseError } from './Errors.js'
import type {
	CollectableAncestorKeys,
	CollectionAncestorKeys
} from './IdElements/PathKeys.js'
import { Pattern, type PathKeys } from './IdElements/index.js'
import type { Tree } from './Tree.js'
import type TypeNode from './TypeNode.js'
import type { DropFirst, Head, LastElementOf } from './Utils/Array.js'
import type { Join, Split } from './Utils/String.js'
import { match } from 'assert'

interface RecursiveId<
	TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts,
	PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
		length: TypeIds['length']
	}
> extends IdParser<TypeIds, PathSegments> {
	/** The current collection recursion depth. */
	get recursionDepth(): this['collectionAncestorKeys']['length']
	get collectionAncestorKeys(): string[]
	get isRecursive(): true
	getCollectionIdParent(): CollectionId
}

abstract class IdParser<
	TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts,
	PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
		length: TypeIds['length']
	}
> implements IdParser.Options<TypeIds, PathSegments>
{
	static tree:
		| Map<string, Datasworn.RulesPackage>
		| Record<string, Datasworn.RulesPackage>
		| null = null

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

	protected set typeIds(value) {
		IdParser.#validateTypeIds(value)

		this.#typeIds = value
	}

	get pathSegments() {
		return this.#pathSegments
	}

	protected set pathSegments(value) {
		IdParser._validatePathSegments(this.typeIds, value)

		this.#pathSegments = value
	}

	/**
	 * This node's ancestor key on {@link Datasworn.RulesPackage}.
	 */
	get typeBranchKey() {
		return TypeId.getBranchKey(this.primaryTypeId)
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

	/**
	 * Returns a string representation of the ID.
	 */
	get id() {
		return IdParser.#toString(this)
	}

	toString(): this['id'] {
		return this.id
	}

	// ID parts

	/** The type ID of the target node. For primary IDs, this is the same as {@link IdParser.typeId}. */
	get typeId() {
		return this.typeIds.at(-1)
	}

	/** The type ID of the most recent primary node. For primary IDs, this is the same as {@link IdParser.typeId} */
	get primaryTypeId() {
		return this.typeIds[0] as TypeId.Primary
	}

	get primaryPath() {
		return this.pathSegments[0]
	}

	get primaryPathKeys() {
		return this.primaryPath.split(CONST.PathKeySep)
	}

	/** The ID of the {@link RulesPackage} that contains this ID, or a wildcard to represent any RulesPackage. */
	get rulesPackageId() {
		return this.primaryPathKeys[0]
	}

	/** The dot-separated, fully-qualified type ID. For primary types, this is the same as {@link IdParser.typeId}  */
	get compositeTypeId() {
		return this.typeIds.join(CONST.TypeSep)
	}

	/** The dot-separated, fully-qualified path. For primary type IDs, this is the same as {@link IdParser.typeId}  */
	get compositePath() {
		return this.pathSegments.join(CONST.TypeSep)
	}

	/** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
	get isWildcard() {
		return this.id.includes(CONST.WildcardString)
	}

	/** Can this ID contain recursive elements in its path? */
	abstract get isRecursive(): boolean

	/** Get an array of the types that are embeddable by this type. */
	getEmbeddableTypes() {
		return TypeId.getEmbeddableTypes(
			this.typeId as TypeId.Any,
			this instanceof EmbeddedId
		)
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is a wildcard ID. If no Datasworn tree is provided (either in {@link IdParser.tree} or as an argument).
	 * @returns The identified node, or `undefined` if the node doesn't exist.
	 */
	get(tree = IdParser.tree): { _id: string } {
		if (tree == null)
			throw new Error(
				`No Datasworn tree found -- set the static property ${IdParser.constructor.name}#tree, or provide one as a parameter.`
			)
		if (this.isWildcard)
			throw new Error(
				`${this.constructor.name}#${this.get.name} expected a non-wildcard ID, but got <${this.id}>. If you want to get wildcard matches, use ${this.constructor.name}#${this.getMatches.name} instead.`
			)

		try {
			return this._getUnsafe(tree)
		} catch (e) {
			return undefined
		}
	}

	/**
	 * Get all Datasworn nodes that match this wildcard ID.
	 * @remarks Non-wildcard IDs work here too; technically they're valid as wildcard IDs.
	 * @returns A {@link Map}
	 */
	getMatches(tree = IdParser.tree): Map<string, { _id: string }> {
		// skip a bunch of iteration if it's not actually a wildcard ID
		if (!this.isWildcard) {
			const match = this.get(tree)
			const matches = new Map()
			if (match != null) matches.set(match._id, match)
			return matches
		}

		return this._getMatchesUnsafe(tree)
	}

	/** Assign `_id` strings in a Datasworn node.
	 * @param node The Datasworn
	 * @param recursive Should IDs be assigned to descendant objects too? (default: true)
	 * @param index A Map used to index items by their assigned ID.
	 * @returns The mutated object.
	 */
	assignIdsIn(
		node: object,
		recursive = true,
		index?: Map<string, unknown>
	): object {
		if (typeof node !== 'object' || node === null)
			throw new Error(
				`Expected a Datasworn node object, but got ${String(node)}`
			)

		if ('_id' in node && typeof node._id === 'string')
			IdParser.logger.warn(
				`Can't assign <${this.id}>, node already has <${node._id}>`
			)
		else {
			if (index instanceof Map && index.has(this.id))
				throw new Error(
					`Generated ID <${this.id}>, but it already exists in the index`
				)

			// @ts-expect-error
			node._id = this.id

			if (index instanceof Map) index.set(this.id, node)
		}

		return node
	}

	/**
	 * Get a Datasworn node by its ID.
	 * @throws If the ID is invalid; if the ID is a wildcard ID; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.tree} or as an argument).
	 */
	static get<T extends StringId.Primary>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): TypeNode.ByType<ExtractTypeId<T>>
	static get<T extends IdParser>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): ReturnType<T['get']>
	static get<T extends StringId.Primary | IdParser>(
		id: T,
		tree = IdParser.datasworn
	) {
		const parsed = id instanceof IdParser ? id : IdParser.parse(id as any)

		return parsed.get(tree)
	}

	/**
	 * Get all Datasworn nodes that match the provided wildcard ID.
	 * @remarks Non-wildcard IDs work here too; technically they're valid as wildcard IDs. You'll just get one match (wrapped in an array).
	 * @returns An array of Datasworn nodes matching the wildcard ID.
	 */
	static getMatches<T extends StringId.Primary>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): TypeNode.ByType<ExtractTypeId<T>>
	static getMatches<T extends IdParser>(
		id: T,
		tree?: (typeof IdParser)['datasworn']
	): ReturnType<T['get']>
	static getMatches<T extends StringId.Primary | IdParser>(
		id: T,
		tree = IdParser.datasworn
	) {
		const parsed = id instanceof IdParser ? id : IdParser.parse(id as any)

		return parsed.getMatches(tree)
	}

	// Public static  methods

	static parse<T extends StringId.NonCollectable>(
		id: T
	): NonCollectableId.FromString<T>
	static parse<T extends StringId.Collectable>(
		id: T
	): CollectableId.FromString<T>
	static parse<T extends StringId.Collection>(id: T): CollectionId.FromString<T>
	static parse<
		T extends StringId.Embedded<
			TypeId.Primary & TypeId.Embedding,
			string,
			TypeId.EmbeddableIn<TypeId.Primary & TypeId.Embedding>,
			string
		>
	>(id: T): EmbeddedId
	static parse(
		id: string
	): CollectionId | CollectableId | NonCollectableId | EmbeddedId
	static parse(id: string): IdParser {
		const { typeIds, pathSegments } = this.#parseOptions(id)
		const [primaryTypeId, ...embeddedTypeIds] = typeIds as [
			TypeId.Primary,
			...TypeId.Embeddable[]
		]
		const [primaryPath, ...embeddedPaths] = pathSegments
		const [rulesPackage, ...pathKeys] = primaryPath.split(CONST.PathKeySep)

		const Ctor = IdParser.#getClassForPrimaryTypeId(
			primaryTypeId as TypeId.Primary
		)
		// @ts-expect-error
		const base = new Ctor(primaryTypeId, rulesPackage, ...pathKeys)

		if (embeddedTypeIds.length === 0) return base

		let lastParser = base as EmbeddingId

		for (let i = 0; i < embeddedTypeIds.length; i++) {
			const typeId = embeddedTypeIds[i] as TypeId.Embeddable
			const pathKey = embeddedPaths[i]
			lastParser = lastParser.createEmbeddedIdChild(typeId, pathKey)
		}

		return lastParser as any
	}

	/**
	 * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
	 * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
	 * @param index If provided, nodes that receive IDs will be indexed in the map (with their ID as the key).
	 * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
	 */
	static assignIdsInRulesPackage<T extends DataswornSource.RulesPackage>(
		rulesPackage: T,
		index?: Map<string, unknown>
	): Extract<Datasworn.RulesPackage, Pick<T, 'type'>> {
		const errorMessages: string[] = []
		for (const typeId in TypeId.BranchKey) {
			const typeBranchKey = TypeId.getBranchKey(typeId as TypeId.Primary)
			const typeBranch = rulesPackage[typeBranchKey]
			if (typeBranch == null) continue

			for (const dictKey in typeBranch) {
				const node = typeBranch[dictKey]
				if (node == null) continue
				try {
					switch (true) {
						case TypeGuard.CollectionType(typeId):
							new CollectionId(typeId, rulesPackage._id, dictKey).assignIdsIn(
								node as TypeNode.ByType<typeof typeId>,
								true,
								index
							)
							break
						case TypeGuard.NonCollectableType(typeId):
							new NonCollectableId(
								typeId,
								rulesPackage._id,
								dictKey
							).assignIdsIn(node as TypeNode.ByType<typeof typeId>, true, index)
							break
					}
				} catch (e) {
					const id = `${typeId}${CONST.PrefixSep}${rulesPackage._id}${CONST.PathKeySep}${dictKey}`
					errorMessages.push(`Failed to create ID within <${id}>. ${String(e)}`)
				}
			}
		}
		if (errorMessages.length > 0) throw new Error(errorMessages.join('\n'))

		// @ts-expect-error
		return rulesPackage
	}

	// Static private methods

	static #validateTypeIds(typeIds: unknown) {
		if (
			!Array.isArray(typeIds) ||
			!typeIds.every((str) => typeof str === 'string')
		)
			throw new Error(
				`Expected an array of strings but got ${JSON.stringify(typeIds)}`
			)

		const primaryTypeId = typeIds[0]

		if (!TypeGuard.PrimaryType(primaryTypeId))
			throw new Error(
				`Expected a primary type but got ${JSON.stringify(primaryTypeId)}`
			)

		for (let i = 1; i < typeIds.length; i++) {
			const embeddedTypeId = typeIds[i]
			const parentTypeId = typeIds[i - 1]
			const parentTypeIsEmbedded = i > 1

			const embeddableTypes = TypeId.getEmbeddableTypes(
				parentTypeId as TypeId.Any,
				parentTypeIsEmbedded
			)

			if (!embeddableTypes.includes(embeddedTypeId as TypeId.Embeddable)) {
				const parentTypeIdComposite = typeIds.slice(0, i).join(CONST.TypeSep)

				throw new Error(
					`Can't embed type "${embeddedTypeId}" in type "${parentTypeIdComposite}"`
				)
			}
		}

		return true
	}

	static #toString({ typeIds, pathSegments }: IdParser.Options) {
		const leftSide = typeIds.join(CONST.TypeSep)
		const rightSide = pathSegments.join(CONST.TypeSep)
		return leftSide + CONST.PrefixSep + rightSide
	}

	protected static _validatePathSegments(
		typeIds: string[],
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

		if (typeIds.length !== pathSegments.length)
			throw new Error(
				`The length of typeIds (${typeIds.length}) and pathSegments (${pathSegments.length}) does't match.`
			)

		const [primaryTypeId, ...embeddedTypeIds] = typeIds

		const errors = []

		const [primaryPath, ...embeddedPaths] = pathSegments as string[]

		try {
			IdParser._validatePrimaryPath(primaryTypeId, primaryPath)
		} catch (e) {
			errors.push(e)
		}

		// if there's no embedded paths, we're done
		if (pathSegments.length === 1) return true

		// TODO: make it so that a single globstar as full path matches any of its type -- even for embedded ones

		if (TypeId.canHaveEmbed(primaryTypeId, false))
			for (let i = 0; i < embeddedPaths.length; i++) {
				const currentTypeIds = typeIds.slice(0, i + 1) as [
					TypeId.Primary,
					...string[]
				]
				const embeddedPath = embeddedPaths[i]
				try {
					EmbeddedId._validateEmbeddedPath(currentTypeIds, embeddedPath)
				} catch (e) {
					errors.push(e)
				}
			}
		else if (embeddedPaths.length > 0) {
			errors.push(
				`"${primaryTypeId}" isn't an embedding type, but received embedded paths: ${JSON.stringify(embeddedPaths)}`
			)
		}

		if (errors.length)
			throw new Error(
				`Expected a valid ID path, but got ${pathSegments.join(CONST.TypeSep)}\n${errors.join('\n')}`
			)

		return true
	}

	protected static _validateEmbeddedPath(
		typeIds: [TypeId.Primary, ...string[]],
		path: string
	) {
		const embeddedTypeId = typeIds.at(-1)

		const pathParts = path.split(CONST.PathKeySep)
		for (const part of pathParts)
			if (
				!(IdParser._validateDictKey(part) || IdParser._validateIndexKey(part))
			)
				throw new Error(
					`Expected a DictKey, array index, or wildcard, but got ${JSON.stringify(part)}`
				)

		return true
	}

	static _validateIndexKey(value: unknown) {
		return TypeGuard.Wildcard(value) || TypeGuard.IndexKey(value as string)
	}

	/**
	 * Parses an ID string in to an IdParser options object without attempting to validate it.
	 */
	static #parseOptions(id: string): IdParser.Options {
		const [leftSide, rightSide] = id.split(CONST.PrefixSep)

		const typeIds = leftSide.split(CONST.TypeSep)
		const pathSegments = rightSide.split(CONST.TypeSep)

		return {
			typeIds,
			pathSegments
		}
	}

	static #getClassForPrimaryTypeId<T extends TypeId.Primary>(
		typeId: T
	): T extends TypeId.NonCollectable
		? typeof NonCollectableId
		: T extends TypeId.Collection
			? typeof CollectionId
			: T extends TypeId.Collectable
				? typeof CollectionId
				: never {
		switch (true) {
			case TypeGuard.CollectionType(typeId):
				// @ts-expect-error
				return CollectionId
			case TypeGuard.CollectableType(typeId):
				// @ts-expect-error
				return CollectableId
			case TypeGuard.NonCollectableType(typeId):
				// @ts-expect-error
				return NonCollectableId
			default:
				throw new Error(
					`Expected TypeId.AnyPrimary, but got ${JSON.stringify(typeId)}`
				)
		}
	}

	static #getPathKeyCount(typeId: TypeId.Primary): {
		min: number
		max: number
	} {
		let min: number, max: number
		switch (true) {
			case TypeGuard.CollectionType(typeId):
				// has a rulespackage
				min = CONST.COLLECTION_DEPTH_MIN + 1
				max = CONST.COLLECTION_DEPTH_MAX + 1
				break
			case TypeGuard.CollectableType(typeId):
				// has a rulespackage + its own key
				min = CONST.COLLECTION_DEPTH_MIN + 2
				max = CONST.COLLECTION_DEPTH_MAX + 2
				break
			case TypeGuard.NonCollectableType(typeId):
				// has a rulespackage
				min = max = CONST.COLLECTION_DEPTH_MIN + 1
				break
			default:
				throw new Error(`Expected primary TypeId but got ${String(typeId)}`)
		}
		return { min, max }
	}

	/**
	 * @throws If the typeId isn't a primary TypeId; if the path doesn't meet the minimum or maximum length for its type; or if any of the individual elements are invalid.
	 */
	protected static _validatePrimaryPath(typeId: string, path: string) {
		if (!TypeGuard.PrimaryType(typeId))
			throw new Error(
				`Expected a primary TypeId, but got ${JSON.stringify(typeId)}. Valid TypeIds are: ${JSON.stringify(TypeId.Primary)}`
			)

		const { min, max } = this.#getPathKeyCount(typeId)

		const [rulesPackageId, ...tail] = path.split(CONST.PathKeySep)

		const errors: string[] = []

		let nonGlobstarCount = 0
		let globstarCount = 0

		switch (true) {
			case TypeGuard.Globstar(rulesPackageId):
				globstarCount++
				break
			case TypeGuard.Wildcard(rulesPackageId):
			case TypeGuard.RulesPackageId(rulesPackageId):
				nonGlobstarCount++
				break
			default:
				errors.push(`Expected RulesPackageId but got ${String(rulesPackageId)}`)
				break
		}

		for (const k of tail)
			switch (true) {
				case TypeGuard.Globstar(k):
					globstarCount++
					break
				case TypeGuard.Wildcard(k):
				case TypeGuard.DictKey(k):
					nonGlobstarCount++
					break
				default:
					errors.push(`Expected DictKey but got ${String(k)}`)
					break
			}

		if (nonGlobstarCount > max)
			// so this error appears first
			errors.unshift(
				`Path expects a maximum length of ${max}, but got ${nonGlobstarCount}`
			)

		if (
			nonGlobstarCount < min &&
			// if there's at least one globstar, then it'll expand to meet the minimum
			!(globstarCount > 0)
		)
			errors.unshift(
				`Path expects a minimum length of ${min}, but got ${nonGlobstarCount}`
			)

		if (errors.length > 0)
			throw new Error(
				`Expected valid Primary ID path but got "${path}".\n\t${errors.join('\n\t')}`
			)

		return true
	}

	/** @internal */
	protected static _validateDictKey(
		key: unknown
	): key is DataswornSource.DictKey {
		return TypeGuard.AnyWildcard(key) || TypeGuard.DictKey(key)
	}

	/** @internal */
	protected static _getMatchesFrom<V>(
		record: Record<string, V>,
		matchKey: string
	): Map<string, V>
	protected static _getMatchesFrom<V>(
		array: Array<V>,
		matchKey: number | CONST.WildcardString | CONST.GlobstarString
	): Map<number, V>
	protected static _getMatchesFrom<V, K extends number | string>(
		map: Map<K, V>,
		matchKey: K | CONST.WildcardString | CONST.GlobstarString
	): Map<K, V>
	protected static _getMatchesFrom<V>(
		record: Record<string, V> | Map<string, V>,
		matchKey: string
	): Map<string, V>
	protected static _getMatchesFrom<
		V,
		TFrom extends Record<string, V> | Array<V> | Map<string, V>
	>(
		obj: TFrom,
		matchKey: string | number = CONST.WildcardString
	): Map<string, V> | Map<number, V> {
		switch (true) {
			case Array.isArray(obj):
				return this.#getMatchesFromArray(obj, matchKey)
			case obj instanceof Map:
				return this.#getMatchesFromMap(obj, matchKey)
			case typeof obj === 'object':
				return this.#getMatchesFromRecord(obj, matchKey.toString())
			default:
				throw new Error(
					`Expected an Array, Map, or Record, but got ${String(obj)}`
				)
		}
	}

	static #getMatchesFromArray<V>(
		array: Array<V>,
		matchKey: string | number = CONST.WildcardString
	): Map<number, V> {
		if (!Array.isArray(array))
			throw new Error(`Expected an Array, but got ${String(array)}`)

		// special case: a wildcard matches everything, so return it as a new Map
		if (TypeGuard.AnyWildcard(matchKey))
			return new Map<number, V>(array.entries())

		const index =
			typeof matchKey === 'string' ? Number.parseInt(matchKey, 10) : matchKey

		if (!Number.isInteger(index))
			throw Error(`Unable to parse an index (integer) from ${String(matchKey)}`)

		const results = new Map<number, V>()

		const match = array[index]

		if (match != null) results.set(index, match)

		return results
	}

	static #getMatchesFromMap<K extends string | number, V>(
		map: Map<K, V>,
		matchKey:
			| K
			| CONST.WildcardString
			| CONST.GlobstarString = CONST.WildcardString
	): Map<K, V> {
		if (!(map instanceof Map))
			throw new Error(`Expected a Map, but got ${String(map)}`)

		// special case: a wildcard matches everything, so return it as a new Map
		if (TypeGuard.AnyWildcard(matchKey)) return new Map(map)

		const results = new Map<K, V>()

		if (map.has(matchKey)) results.set(matchKey, map.get(matchKey))

		return results
	}

	static #getMatchesFromRecord<V>(
		record: Record<string, V>,
		matchKey: string
	): Map<string, V> {
		if (record == null || typeof record !== 'object' || Array.isArray(record))
			throw new Error(`Expected a Record object, but got ${String(record)}`)

		const results = new Map<string, V>()

		switch (true) {
			case TypeGuard.AnyWildcard(matchKey):
				for (const k in record)
					if (Object.hasOwn(record, k)) results.set(k, record[k])
				break
			case Object.hasOwn(record, matchKey):
				results.set(matchKey, record[matchKey])
				break
			default:
				break
		}

		return results
	}

	// Static properties

	/** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
	static datasworn: Tree | null = null

	static readonly RulesPackagePattern = Pattern.RulesPackageElement
	static readonly DictKeyPattern = Pattern.DictKeyElement
	static readonly RecursiveDictKeyPattern = Pattern.RecursiveDictKeysElement

	/** @internal */
	protected _getRulesPackage(
		tree: (typeof IdParser)['tree'] = IdParser.tree
	): Datasworn.RulesPackage | undefined {
		if (tree == null)
			throw new Error(
				`No Datasworn tree found -- set the static property ${IdParser.constructor.name}#tree, or provide one as a parameter.`
			)
		if (this.isWildcard)
			throw new Error(
				`${this.constructor.name}#${this.get.name} expected a non-wildcard ID, but got <${this.id}>. If you want to get wildcard matches, use ${this.constructor.name}#${this.getMatches.name} instead.`
			)

		if (tree instanceof Map) return tree.get(this.rulesPackageId) ?? undefined
		return tree[this.rulesPackageId] ?? undefined
	}

	/** @internal */
	protected _getTypeBranch(
		tree: (typeof IdParser)['tree'] = IdParser.tree
	): Record<string, unknown> | Map<string, unknown> | undefined {
		const pkg = this._getRulesPackage(tree)

		if (pkg == null)
			throw new Error(
				`Couldn't find a RulesPackage with the id "${this.rulesPackageId}"`
			)

		return pkg[this.typeBranchKey]
	}

	/** @internal */
	protected _getUnsafe(tree: (typeof IdParser)['tree'] = IdParser.tree) {
		const typeBranch = this._getTypeBranch(tree)

		if (typeBranch == null)
			throw new Error(
				`RulesPackage <${this.rulesPackageId}> doesn't have a "${this.typeBranchKey}" type branch.`
			)

		const [_rulesPackageId, key, ..._tailKeys] = this.primaryPathKeys

		let result: { _id: string } | undefined

		if (typeBranch instanceof Map)
			result = (typeBranch.get(key) as { _id: string }) ?? undefined
		else result = (typeBranch[key] as { _id: string }) ?? undefined

		if (result == null)
			throw new Error(
				`Couldn't find key <${key}> in <${this.rulesPackageId}.${this.typeBranchKey}>`
			)

		return result
	}

	/** @internal */
	protected _matchRulesPackages(
		tree = IdParser.tree
	): Map<string, Datasworn.RulesPackage> {
		if (tree == null)
			throw new Error(
				`No Datasworn tree found -- set the static property ${IdParser.constructor.name}#tree, or provide one as a parameter.`
			)

		return IdParser._getMatchesFrom(tree, this.rulesPackageId)
	}

	/**
	 * @internal */
	_getMatchesUnsafe(tree = IdParser.tree): Map<string, { _id: string }> {
		const pkgs = this._matchRulesPackages(tree)
		const results = new Map<string, { _id: string }>()

		const [_rulesPackageId, nextKey] = this.primaryPathKeys

		for (const pkg of pkgs.values()) {
			const typeBranch = pkg[this.typeBranchKey] as
				| Record<string, { _id: string }>
				| Map<string, { _id: string }>
			if (typeBranch == null) continue
			const matches = IdParser._getMatchesFrom(typeBranch, nextKey)
			for (const [_, match] of matches) results.set(match._id, match)
		}

		return results
	}
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

abstract class EmbeddingId<
	TypeIds extends StringId.TypeIdParts = StringId.TypeIdParts,
	PathSegments extends string[] & { length: TypeIds['length'] } = string[] & {
		length: TypeIds['length']
	}
> extends IdParser<TypeIds, PathSegments> {
	/**
	 * Create a child EmbeddedId with a given type and key.
	 */
	createEmbeddedIdChild(
		embeddedTypeId: TypeId.Embeddable,
		key: string
	): EmbeddedId {
		return new EmbeddedId(this, embeddedTypeId, key)
	}

	get embeddableTypes(): string[] {
		return TypeId.getEmbeddableTypes(
			this.typeId as TypeId.Any,
			this instanceof EmbeddedId
		)
	}

	override assignIdsIn(
		node: object,
		recursive?: boolean,
		index?: Map<string, unknown>
	): object {
		const result = super.assignIdsIn(node, recursive, index)

		if (recursive)
			for (const embedTypeId of this.getEmbeddableTypes()) {
				const property = TypeId.getEmbeddedPropertyKey(embedTypeId)

				if (typeof node !== 'object') continue

				if (!(property in node)) continue

				const childNodes = node[property] as
					| Record<string, { _id?: string }>
					| Map<string, { _id?: string }>
					| Array<{ _id?: string }>
				if (childNodes == null) continue

				if (Array.isArray(childNodes)) {
					this.#assignEmbeddedIdsInArray(
						childNodes,
						embedTypeId,
						recursive,
						index
					)
				} else if (childNodes instanceof Map) {
					this.#assignEmbeddedIdsInMap(
						childNodes,
						embedTypeId,
						recursive,
						index
					)
				} else {
					this.#assignEmbeddedIdsInRecord(
						childNodes,
						embedTypeId,
						recursive,
						index
					)
				}
			}
		return result
	}

	#assignEmbeddedIdsInMap(
		children: Map<string, { _id?: string }>,
		nextTypeId: TypeId.Embeddable,
		recursive?: boolean,
		index?: Map<string, unknown>
	) {
		children.forEach((childNode, k) =>
			this.createEmbeddedIdChild(nextTypeId, k.toString()).assignIdsIn(
				childNode,
				recursive,
				index
			)
		)
	}

	#assignEmbeddedIdsInRecord(
		children: Record<string, { _id?: string }>,
		nextTypeId: TypeId.Embeddable,
		recursive?: boolean,
		index?: Map<string, unknown>
	) {
		for (const k in children) {
			if (!Object.hasOwn(children, k)) continue
			const childNode = children[k]
			if (childNode == null) continue
			const childParser = this.createEmbeddedIdChild(nextTypeId, k)
			childParser.assignIdsIn(childNode, recursive, index)
		}
	}

	#assignEmbeddedIdsInArray(
		children: { _id?: string }[],
		nextTypeId: TypeId.Embeddable,
		recursive?: boolean,
		index?: Map<string, unknown>
	) {
		children.forEach((childNode, i) =>
			this.createEmbeddedIdChild(nextTypeId, i.toString()).assignIdsIn(
				childNode,
				recursive,
				index
			)
		)
	}
}
namespace EmbeddingId {
	export type EmbeddedIn<
		T extends EmbeddingId = EmbeddingId,
		TEmbedType extends TypeId.Embeddable = TypeId.Embeddable,
		K extends string = string
	> = T extends EmbeddingId ? EmbeddedId<EmbeddingId, TEmbedType, K> : never
}

class NonCollectableId<
	TTypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends string = string,
	Key extends string = string
> extends EmbeddingId<[TTypeId], [Join<[RulesPackage, Key]>]> {
	get isRecursive(): false {
		return false
	}

	constructor(typeId: TTypeId, rulesPackage: RulesPackage, key: Key) {
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
	TTypeId extends TypeId.NonCollectable = TypeId.NonCollectable,
	RulesPackage extends string = string,
	Key extends string = string
> extends EmbeddingId<[TTypeId], [`${RulesPackage}${CONST.PathKeySep}${Key}`]> {
	get id(): StringId.NonCollectable<TTypeId, RulesPackage, Key>
	get rulesPackageId(): RulesPackage
	get typeId(): TTypeId

	// TODO: explicit typing for create embed method
	// TODO: (on EmbeddingId) throw/fail validation if it receives an inappropriate embed type

	createEmbeddedIdChild<
		T extends TTypeId extends TypeId.Embedding
			? TypeId.EmbeddableIn<TTypeId>
			: never,
		K extends string
	>(
		embeddedTypeId: T,
		key: string
	): TTypeId extends TypeId.Embedding ? EmbeddedId<this, T, K> : never

	/** @internal */
	_getTypeBranch(
		tree?: (typeof IdParser)['tree']
	):
		| Map<string, TypeNode.NonCollectable<TTypeId>>
		| Record<string, TypeNode.NonCollectable<TTypeId>>
		| undefined

	get(
		tree?: (typeof IdParser)['tree']
	): TypeNode.NonCollectable<TTypeId> | undefined

	getMatches(
		tree?: (typeof IdParser)['tree']
	): Map<string, TypeNode.NonCollectable<TTypeId>>

	/** @internal */
	_getUnsafe(tree?: (typeof IdParser)['tree']): TypeNode.NonCollectable<TTypeId>

	// no override needed, as they only have the one key
	/** @internal */
	_getMatchesUnsafe(
		tree?: (typeof IdParser)['tree']
	): Map<string, TypeNode.NonCollectable<TTypeId>>
}
namespace NonCollectableId {
	export type FromString<T extends StringId.NonCollectable> = NonCollectableId<
		StringId.ExtractNonCollectableType<T>,
		StringId.ExtractPrimaryRulesPackage<T>,
		StringId.ExtractNonCollectableKey<T>
	>

	type f = FromString<'delve_site:delve/alvas_rest'>
}

class CollectableId<
		TTypeId extends TypeId.Collectable = TypeId.Collectable,
		RulesPackage extends string = string,
		CollectableAncestorKeys extends
			PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
		Key extends string = string
	>
	extends EmbeddingId<
		[TTypeId],
		[Join<[RulesPackage, ...CollectableAncestorKeys, Key]>]
	>
	implements
		RecursiveId<
			[TTypeId],
			[Join<[RulesPackage, ...CollectableAncestorKeys, Key]>]
		>
{
	get isRecursive(): true {
		return true
	}

	get embeddableTypes(): TTypeId extends TypeId.Embedding
		? [...TypeId.EmbeddableIn<TTypeId>[]]
		: [] {
		return TypeId.getEmbeddableTypes(this.primaryTypeId, false) as any
	}

	constructor(
		typeId: TTypeId,
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

	get collectionAncestorKeys(): CollectableAncestorKeys {
		// 1st element is the RulesPackageId, which isn't counted.
		// last element is the key of this collectable, which isn't counted.
		return this.primaryPathKeys.slice(1, -1) as CollectableAncestorKeys
	}

	get recursionDepth(): CollectableAncestorKeys['length'] {
		return this.collectionAncestorKeys.length
	}

	get parentTypeId() {
		return TypeId.getCollectionOf(this.typeId)
	}

	getCollectionIdParent() {
		const ancestorKeys = this.primaryPathKeys.slice(0, -1) as [
			RulesPackage,
			...Head<CollectableAncestorKeys>,
			LastElementOf<CollectableAncestorKeys>
		]

		return new CollectionId<
			TypeId.CollectionOf<TTypeId>,
			RulesPackage,
			Head<CollectableAncestorKeys> & CollectionAncestorKeys,
			LastElementOf<CollectableAncestorKeys>
		>(this.parentTypeId, ...ancestorKeys)
	}

	/** @internal */
	override _getUnsafe(
		tree: (typeof IdParser)['tree'] = IdParser.tree
	): TypeNode.Collectable<TTypeId> {
		const parent = this.getCollectionIdParent()
		const parentNode = parent._getUnsafe(tree)

		// console.log(`<${this.id}> got parent`, parentNode)
		const thisKey = this.primaryPathKeys.at(-1)

		const { contents } = parentNode

		let result: TypeNode.Collectable<TTypeId>

		if (contents instanceof Map) result = contents.get(thisKey)
		else if (Object.hasOwn(contents, thisKey))
			result = contents[
				thisKey as keyof typeof contents
			] as TypeNode.Collectable<TTypeId>

		if (result == null) throw new Error(`No result for <${this.id}>`)

		return result
	}

	/** @internal */
	_getMatchesUnsafe(
		tree = IdParser.tree
	): Map<string, TypeNode.Collectable<TTypeId>> {
		const parentId = this.getCollectionIdParent()

		let matches: Map<string, TypeNode.Collectable<TTypeId>>
		const thisKey = this.primaryPathKeys.at(-1)

		const parentMatches = parentId._getMatchesUnsafe(tree)

		for (const parentMatch of parentMatches.values()) {
			const contents = parentMatch[CONST.ContentsKey] as
				| Record<string, TypeNode.Collectable<TTypeId>>
				| Map<string, TypeNode.Collectable<TTypeId>>
			if (contents == null) continue
			const collectables = IdParser._getMatchesFrom(contents, thisKey)
			for (const match of collectables.values()) {
				matches ||= new Map()
				matches.set(match._id, match)
			}
		}

		return matches ?? new Map()
	}
}

interface CollectableId<
	TTypeId extends TypeId.Collectable = TypeId.Collectable,
	RulesPackage extends string = string,
	CollectableAncestorKeys extends
		PathKeys.CollectableAncestorKeys = PathKeys.CollectableAncestorKeys,
	Key extends string = string
> extends RecursiveId<
		[TTypeId],
		[Join<[RulesPackage, ...CollectableAncestorKeys, Key]>]
	> {
	// declaring these so TS doesn't have to compute them

	get id(): StringId.Collectable<
		TTypeId,
		RulesPackage,
		CollectableAncestorKeys,
		Key
	>

	createEmbeddedIdChild<
		T extends TTypeId extends TypeId.Embedding
			? TypeId.EmbeddableIn<TTypeId>
			: never,
		K extends string
	>(
		embeddedTypeId: T,
		key: string
	): TTypeId extends TypeId.Embedding ? EmbeddedId<this, T, K> : never

	assignIdsIn<T extends TypeNode.CollectableSource<TTypeId>>(
		node: T,
		recursive?: boolean,
		index?: Map<string, unknown>
	): TypeNode.Collectable<TTypeId>

	get typeId(): TTypeId
	get primaryTypeId(): TTypeId
	get primaryPathKeys(): [RulesPackage, ...CollectableAncestorKeys, Key]
	get isCollection(): false
	get isCollectable(): true
	get compositeTypeId(): TTypeId
	get rulesPackageId(): RulesPackage

	/** @internal */
	_getTypeBranch(
		tree?: (typeof IdParser)['tree']
	):
		| Record<string, TypeNode.Collection<TypeId.CollectionOf<TTypeId>>>
		| Map<string, TypeNode.Collection<TypeId.CollectionOf<TTypeId>>>
		| undefined

	get(
		tree?: (typeof IdParser)['tree']
	): TypeNode.Collectable<TTypeId> | undefined
}
namespace CollectableId {
	export type FromString<T extends StringId.Collectable> =
		T extends `${infer TypeId extends TypeId.Collectable}${CONST.PrefixSep}${infer RulesPackage extends string}${CONST.PathKeySep}${infer AncestorKeys extends Join<CollectableAncestorKeys>}${CONST.PathKeySep}${infer Key extends string}`
			? // @ts-expect-error
				CollectableId<TypeId, RulesPackage, Split<AncestorKeys>, Key>
			: never

	type f = FromString<'atlas_entry:classic/ironlands/tempest_hills'>
}

class CollectionId<
		TTypeId extends TypeId.Collection = TypeId.Collection,
		RulesPackage extends string = string,
		CollectionAncestorKeys extends
			PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
		Key extends string = string
	>
	extends IdParser<
		[TTypeId],
		[Join<[RulesPackage, ...CollectionAncestorKeys, Key]>]
	>
	implements
		RecursiveId<
			[TTypeId],
			[Join<[RulesPackage, ...CollectionAncestorKeys, Key]>]
		>
{
	constructor(
		typeId: TTypeId,
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

	get isRecursive(): true {
		return true
	}

	get recursionDepth(): CollectionAncestorKeys['length'] {
		// first element is the RulesPackageId, which isn't counted.
		return this.collectionAncestorKeys.length
	}

	get collectionAncestorKeys() {
		// 1st key is the RulesPackageId, so it's omitted
		// last key is this Collection node -- it's omitted too
		// everything but the last key, which belongs to the node itself
		return this.primaryPathKeys.slice(1, -1) as CollectionAncestorKeys
	}

	/**
	 * Create an ID representing a {@link CollectableId} child of this CollectionId, using the provided key.
	 * @example
	 * ```typescript
	 * const collection = IdParser.parse('oracle_collection:starforged/core')
	 * const collectable = collection.createCollectableIdChild('action')
	 * console.log(collectable.toString()) // 'oracle_rollable:starforged/core/action'
	 * ```
	 */
	createCollectableIdChild<ChildKey extends string>(
		key: ChildKey
	): CollectableId<
		TypeId.CollectableOf<TTypeId>,
		RulesPackage,
		[...CollectionAncestorKeys, Key],
		ChildKey
	> {
		return new CollectableId<
			TypeId.CollectableOf<TTypeId>,
			RulesPackage,
			[...CollectionAncestorKeys, Key],
			ChildKey
		>(TypeId.getCollectableOf(this.primaryTypeId), ...this.primaryPathKeys, key)
	}

	/**
	 * Create an ID representing a Collection child of this CollectionId, using the provided key.
	 * @throws If a child collection ID can't be created because the maximum recursion depth has been reached.
	 * @see {@link CONST.COLLECTION_DEPTH_MAX}
	 * @example
	 * ```typescript
	 * const collection = IdParser.parse('oracle_collection:starforged/planet')
	 * const childCollection = collection.createCollectionIdChild('furnace')
	 * console.log(childCollection.toString()) // 'oracle_collection:starforged/planet/furnace'
	 * ```
	 */
	createCollectionIdChild<ChildKey extends string>(
		key: ChildKey
	): CollectionId.ChildCollectionOf<this, ChildKey> {
		if (this.recursionDepth >= CONST.COLLECTION_DEPTH_MAX)
			throw new ParseError(
				this.id,
				`Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${CONST.COLLECTION_DEPTH_MAX})`
			)

		return new CollectionId(
			this.primaryTypeId,
			...this.primaryPathKeys,
			key
		) as any
	}

	override assignIdsIn<T extends TypeNode.CollectionSource<TTypeId>>(
		node: T,
		recursive = true,
		index?: Map<string, unknown>
	): TypeNode.Collection<TTypeId> {
		// run this up front so the log ordering is more intuitive
		const base = super.assignIdsIn(node, recursive, index)

		if (recursive) {
			if (CONST.ContentsKey in node && node[CONST.ContentsKey] != null)
				for (const childKey in node[CONST.ContentsKey]) {
					const childNode = node[CONST.ContentsKey][childKey]
					if (childNode == null) continue
					const childParser = this.createCollectableIdChild(childKey)
					childParser.assignIdsIn(childNode as any, recursive, index)
				}
			if (CONST.CollectionsKey in node && node[CONST.CollectionsKey] != null)
				for (const childKey in node[CONST.CollectionsKey]) {
					const childCollection = node[CONST.CollectionsKey][childKey]
					if (childCollection == null) continue
					const childParser = this.createCollectionIdChild(childKey)
					childParser.assignIdsIn(childCollection as any, recursive, index)
				}
		}

		return base as TypeNode.Collection<TTypeId>
	}

	/**
	 * Returns a CollectionId representing the parent collection of this ID.
	 * @throws If a parent collection ID isn't possible (because this ID doesn't have a parent collection.)
	 * @example
	 * ```typescript
	 * const collection = IdParser.parse('oracle_collection:starforged/planet/jungle/settlements')
	 * const parentCollection = collection.getCollectionIdParent()
	 * console.log(parentCollection.toString()) // 'oracle_collection:starforged/planet/jungle'
	 * ```
	 */
	getCollectionIdParent(): CollectionId.ParentCollectionOf<this> {
		if (this.collectionAncestorKeys.length === 0)
			throw new ParseError(
				this.id,
				`Can't generate a parent ID because this ID has no ancestors.`
			)

		return new CollectionId(
			this.primaryTypeId,
			this.rulesPackageId,
			...(this.collectionAncestorKeys as any)
		) as any
	}

	/** @internal */
	override _getUnsafe(
		tree?:
			| Record<string, Datasworn.RulesPackage>
			| Map<string, Datasworn.RulesPackage>
	): TypeNode.Collection<TTypeId> {
		const ancestorNode = super._getUnsafe(tree) as TypeNode.Collection<TTypeId>
		const [_rulesPackage, _ancestorKey, ...keys] = this.primaryPathKeys

		const ancestorNodes = [ancestorNode]

		for (const key of keys) {
			const currentNode = ancestorNodes.at(-1)
			if (!(CONST.CollectionsKey in currentNode))
				throw new Error(
					`Couldn't find collection <${key}> in <${currentNode._id}>`
				)
			const nextNode = currentNode[CONST.CollectionsKey][
				key
			] as TypeNode.ByType<TTypeId>
			if (nextNode == null)
				throw new Error(
					`Expected collection <${key}> in <${currentNode._id}>, but got ${String(nextNode)}`
				)
			ancestorNodes.push(nextNode)
		}

		return ancestorNodes.at(-1)
	}

	/** @internal */
	protected static _recurseMatches<T extends TypeNode.Collection>(
		from: T,
		keys: string[],
		matches = new Map<string, T>(),
		depth = 0
	): Map<string, T> {
		// console.log(keys)

		if (keys.length === 0) return matches.set(from._id, from)

		if (depth > CONST.COLLECTION_DEPTH_MAX) {
			console.warn(
				`Exceeded max collection depth (${CONST.COLLECTION_DEPTH_MAX}) @ <${from._id}>`
			)
			return matches
		}

		const [currentKey, ...tailKeys] = keys

		const childCollections = from[CONST.CollectionsKey] as
			| Record<string, T>
			| Map<string, T>

		if (childCollections == null) return matches

		const childMatches = IdParser._getMatchesFrom<T>(
			childCollections,
			currentKey
		)

		for (const child of childMatches.values()) {
			if (TypeGuard.Globstar(currentKey)) {
				// recurse through children without consuming the globstar
				for (const [matchId, match] of CollectionId._recurseMatches<T>(
					child,
					keys,
					matches,
					depth + 1
				))
					matches.set(matchId, match)
			}
			// regular key + * matches
			for (const [matchId, match] of CollectionId._recurseMatches<T>(
				child,
				tailKeys,
				matches,
				depth + 1
			))
				matches.set(matchId, match)
		}

		return matches
	}

	/** @internal */
	override _getMatchesUnsafe(
		tree = IdParser.tree
	): Map<string, TypeNode.Collection<TTypeId>> {
		const pkgs = this._matchRulesPackages(tree)

		// defer creating this until we need it
		let matches: Map<string, TypeNode.Collection<TTypeId>>

		const [rulesPackageId, currentKey, ...tailKeys] = this.primaryPathKeys

		for (const pkg of pkgs.values()) {
			const typeBranch = pkg[this.typeBranchKey] as
				| Record<string, TypeNode.Collection<TTypeId>>
				| Map<string, TypeNode.Collection<TTypeId>>

			if (typeBranch == null) continue

			const collectionMatches = IdParser._getMatchesFrom<
				TypeNode.Collection<TTypeId>
			>(typeBranch, currentKey)

			for (const collection of collectionMatches.values())
				if (TypeGuard.Globstar(rulesPackageId)) {
					// carry forward the rules package globstar if it's present
					matches = new Map([
						...CollectionId._recurseMatches(
							collection,
							[CONST.GlobstarString, currentKey, ...tailKeys],
							matches
						),
						...CollectionId._recurseMatches(
							collection,
							[currentKey, ...tailKeys],
							matches
						)
					])
				} else if (TypeGuard.Globstar(currentKey)) {
					// carry forward current key if it's a globstar
					matches = new Map([
						...CollectionId._recurseMatches(
							collection,
							[currentKey, ...tailKeys],
							matches
						),
						...CollectionId._recurseMatches(collection, tailKeys, matches)
					])
				} else
					matches = CollectionId._recurseMatches(collection, tailKeys, matches)
		}

		return matches ?? new Map()
	}
}

interface CollectionId<
	TTypeId extends TypeId.Collection = TypeId.Collection,
	RulesPackage extends string = string,
	CollectionAncestorKeys extends
		PathKeys.CollectionAncestorKeys = PathKeys.CollectionAncestorKeys,
	Key extends string = string
> extends RecursiveId<
		[TTypeId],
		[Join<[RulesPackage, ...CollectionAncestorKeys, Key]>]
	> {
	get compositeTypeId(): TTypeId
	get rulesPackageId(): RulesPackage

	get typeId(): TTypeId

	get isCollectable(): false
	get isCollection(): true
	get id(): StringId.Collection<
		TTypeId,
		RulesPackage,
		CollectionAncestorKeys,
		Key
	>
	get primaryTypeId(): TTypeId
	get primaryPathKeys(): [RulesPackage, ...CollectionAncestorKeys, Key]

	/** @internal */
	_getTypeBranch(
		tree?: (typeof IdParser)['tree']
	):
		| Record<string, TypeNode.Collection<TTypeId>>
		| Map<string, TypeNode.Collection<TTypeId>>
		| undefined

	get(
		tree?: (typeof IdParser)['tree']
	): TypeNode.Collection<TTypeId> | undefined
}

namespace CollectionId {
	export type FromString<T extends StringId.Collection> =
		T extends `${infer TypeId extends TypeId.Collection}${CONST.PrefixSep}${infer RulesPackage extends string}${CONST.PathKeySep}${infer AncestorKeys extends Join<CollectionAncestorKeys>}${CONST.PathKeySep}${infer Key extends string}`
			? CollectionId<TypeId, RulesPackage, Split<AncestorKeys>, Key>
			: never

	export type ChildOf<
		T extends CollectionId,
		K extends string = string
	> = CollectableId<
		TypeId.CollectableOf<T['primaryTypeId']>,
		T['rulesPackageId'],
		T extends CollectionId<
			T['primaryTypeId'],
			T['rulesPackageId'],
			infer U extends CollectionAncestorKeys,
			infer K extends string
		>
			? [...U, K]
			: never,
		K
	>
	export type ChildCollectionOf<T extends CollectionId, K extends string = string> =
		DropFirst<T['primaryPathKeys']> extends CollectionAncestorKeys
			? CollectionId<
					T['typeId'],
					T['rulesPackageId'],
					DropFirst<T['primaryPathKeys']>,
					K
				>
			: never

	export type ParentCollectionOf<T extends CollectionId> =
		T['collectionAncestorKeys'] extends [infer K extends string]
			? CollectionId<T['primaryTypeId'], T['rulesPackageId'], [], K>
			: T['collectionAncestorKeys'] extends [
						infer U extends string,
						infer K extends string
				  ]
				? CollectionId<T['primaryTypeId'], T['rulesPackageId'], [U], K>
				: T['collectionAncestorKeys'] extends [
							...infer U extends PathKeys.CollectionAncestorKeys,
							infer K extends string
					  ]
					? CollectionId<T['primaryTypeId'], T['rulesPackageId'], U, K>
					: never
}

// @ts-expect-error
class EmbeddedId<
	ParentId extends EmbeddingId = EmbeddingId,
	TTypeId extends TypeId.Embeddable = TypeId.Embeddable,
	Key extends string = string
> extends EmbeddingId<
	[...ParentId['typeIds'], TTypeId],
	[...ParentId['pathSegments'], Key] & {
		length: [...ParentId['typeIds'], TTypeId]['length']
	}
> {
	readonly #parent: ParentId

	/**
	 * Returns the embedding ID parent of this ID.
	 */
	getEmbeddingIdParent(): ParentId {
		return this.#parent
	}

	/** @internal */
	constructor(parent: ParentId, typeId: TTypeId, key: string)
	constructor(parent: ParentId, typeId: TTypeId, index: number)
	constructor(parent: ParentId, typeId: TTypeId, key: Key) {
		const options = {
			typeIds: [...parent.typeIds, typeId] as [...ParentId['typeIds'], TTypeId],
			pathSegments: [...parent.pathSegments, key.toString()] as [
				...ParentId['pathSegments'],
				Key
			] & {
				length: [...ParentId['typeIds'], TTypeId]['length']
			}
		} as const satisfies IdParser.Options<
			[...ParentId['typeIds'], TTypeId],
			[...ParentId['pathSegments'], Key] & {
				length: [...ParentId['typeIds'], TTypeId]['length']
			}
		>

		super(options)
		this.#parent = parent
	}
}
// @ts-expect-error
interface EmbeddedId<
	ParentId extends EmbeddingId = EmbeddingId,
	TTypeId extends TypeId.Embeddable = TypeId.Embeddable,
	Key extends string = string
> extends EmbeddingId<
		[...ParentId['typeIds'], TTypeId],
		[...ParentId['pathSegments'], Key] & {
			length: [...ParentId['typeIds'], TTypeId]['length']
		}
	> {
	get id(): `${this['compositeTypeId']}${CONST.PrefixSep}${Join<this['pathSegments'], CONST.TypeSep>}`

	get embeddableTypes(): TTypeId extends TypeId.EmbeddingWhenEmbeddedType
		? [...TypeId.EmbeddableInEmbeddedType<TTypeId>[]]
		: []

	get(): TypeNode.Embedded<TTypeId>

	get typeId(): TTypeId
	get typeIds(): [...ParentId['typeIds'], TTypeId]
	get pathSegments(): [...ParentId['pathSegments'], Key]

	get primaryTypeId(): ParentId['primaryTypeId']
	get primaryPathKeys(): ParentId['primaryPathKeys']
	get isRecursive(): ParentId['isRecursive']
	get compositeTypeId(): `${ParentId['compositeTypeId']}${CONST.TypeSep}${TTypeId}`
}

export { CollectableId, CollectionId, EmbeddedId, IdParser, NonCollectableId }

