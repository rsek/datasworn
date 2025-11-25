import {
	CloneType,
	Type,
	type StringOptions,
	type TRef,
	type TSchema,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import type TypeNode from '../pkg-core/TypeNode.js'
import {
	WildcardString,
	PathKeySep,
	COLLECTION_DEPTH_MIN,
	COLLECTION_DEPTH_MAX,
	TypeSep,
	PrefixSep,
	CollectionsKey,
	ContentsKey
} from '../scripts/const.js'
import TypeId from '../pkg-core/IdElements/TypeId.js'
import Pattern from '../pkg-core/IdElements/Pattern.js'
import type { Datasworn } from '../pkg-core/index.js'
import { pascalCase } from '../schema/utils/string.js'
import type { Join, PascalCase, Split } from 'type-fest'
import { JsonTypeDef } from '../schema/Symbols.js'
import JtdType from '../scripts/json-typedef/typedef.js'
import { TypeGuard } from '../pkg-core/IdElements/index.js'
import { escapeRegExp, snakeCase } from 'lodash-es'

type RegexGroupType =
	| 'none'
	| 'capture_group'
	| 'non_capturing_group'
	| 'named_capture_group'

// inexact but enough to catch some errors
type ValidDictKey = Exclude<string, `_${string}` | `${number}`>

type Dict<T = unknown> = Record<ValidDictKey, T>

type PropKeysOfType<O, T> = {
	[P in string & keyof O]-?: O[P] extends T ? P : never
}[keyof O & string]

// type DictPropKeyIn<O> = PropKeysOfType<O, Dict>
type DictPropKeyIn<O> = keyof O
// type ArrayPropKeyIn<O> = PropKeysOfType<O, Array<any>>
type ArrayPropKeyIn<O> = keyof O

type EntryInProp<
	O,
	P extends DictPropKeyIn<O> | ArrayPropKeyIn<O>
> = O[P] extends Array<any> ? O[P][number] : O[P][keyof O[P]]

/**
 * Represents a single, slash-separated path element of a Datasworn ID.
 * @template Origin The object type of the starting point of this path element.
 */
abstract class PathSymbol<Origin, Key extends keyof Origin = keyof Origin> {
	readonly inProperty: Key
	abstract get pattern(): RegExp
	abstract get wildcardPattern(): RegExp

	abstract clone(...args: any[]): this

	constructor(inProperty: Key) {
		this.inProperty = inProperty
	}
}

namespace PathSymbol {
	export class RulesPackage extends PathSymbol<null> {
		static readonly WILDCARD = new RegExp(
			// TODO: proper handling for standalone RulesPackage globstars
			// `(?:${Pattern.RulesPackageElement.source}|\\${WildcardString}|\\${WildcardString}\\${WildcardString})`
			`(?:${Pattern.RulesPackageElement.source}|${escapeRegExp(WildcardString)})`
		)

		get pattern() {
			return Pattern.RulesPackageElement
		}

		get wildcardPattern() {
			return RulesPackage.WILDCARD
		}

		constructor() {
			// @ts-expect-error
			super(null)
		}

		clone() {
			return new PathSymbol.RulesPackage() as this
		}
	}

	export class DictKey<
		Origin,
		Prop extends DictPropKeyIn<Origin>
	> extends PathSymbol<Origin, Prop> {
		static readonly PATTERN = Pattern.DictKeyElement
		static readonly WILDCARD = new RegExp(
			`${DictKey.PATTERN.source}|\\${PathKeySep}\\${WildcardString}|\\${PathKeySep}\\${WildcardString}\\${WildcardString}`
		)

		public get minReps(): number {
			return COLLECTION_DEPTH_MIN
		}

		public get maxReps(): number {
			return COLLECTION_DEPTH_MIN
		}

		get pattern() {
			return DictKey.PATTERN
		}

		get wildcardPattern() {
			return DictKey.WILDCARD
		}

		clone() {
			return new DictKey<Origin, Prop>(this.inProperty) as this
		}

		static get stringTemplateLiteral() {
			// eslint-disable-next-line no-template-curly-in-string
			return '${string}'
		}

		static renderDictKeys(min: number, max: number, wildcard = false): RegExp {
			// exit early if there's nothing to do
			if (min === 1 && max === 1)
				return wildcard
					? PathSymbol.DictKey.WILDCARD
					: PathSymbol.DictKey.PATTERN

			const base = wildcard
				? `${IdPattern.PathSep}(?:${PathSymbol.DictKey.PATTERN.source}|${IdPattern.WILDCARD}|${IdPattern.GLOBSTAR})`
				: IdPattern.PathSep + PathSymbol.DictKey.PATTERN.source

			const minMax = min === max ? min.toString() : `${min},${max}`

			const wrappedKey = `(?:${base}){${minMax}}`

			if (!wildcard) return RegExp(wrappedKey)

			return new RegExp(wrappedKey)
		}

		static repsStringTemplateLiteral(min: number, max: number) {
			let variantsToGenerate = max - min + 1

			const variants: string[] = []

			while (variantsToGenerate > 0) {
				const variantParts: string[] = []

				for (let i = 0; i < variantsToGenerate; i++)
					variantParts.push(DictKey.stringTemplateLiteral)

				variants.push(variantParts.join(PathKeySep))

				variantsToGenerate--
			}
			return variants
		}

		static reduceReps(...dictKeys: DictKey<any, any>[]) {
			const min = dictKeys.reduce((a, b) => a + b.minReps, 0)
			const max = dictKeys.reduce((a, b) => a + b.maxReps, 0)
			return { min, max }
		}
	}

	export class RecursiveDictKeys<
		Origin,
		Prop extends DictPropKeyIn<Origin>,
		RecursiveProp extends DictPropKeyIn<EntryInProp<Origin, Prop>>
	> extends DictKey<Origin, Prop> {
		readonly recursiveProperty: RecursiveProp

		override get minReps() {
			return COLLECTION_DEPTH_MIN
		}

		override get maxReps() {
			return COLLECTION_DEPTH_MAX
		}

		constructor(inProperty: Prop, recursiveProperty: RecursiveProp) {
			super(inProperty)
			this.recursiveProperty = recursiveProperty
		}

		clone<
			CloneProp extends DictPropKeyIn<Origin> = Prop,
			CloneRecursiveProp extends DictPropKeyIn<
				EntryInProp<Origin, Prop>
			> = RecursiveProp
		>() {
			// @ts-expect-error
			return new RecursiveDictKeys<Origin, CloneProp, CloneRecursiveProp>(
				this.inProperty,
				this.recursiveProperty
			) as this
		}
	}

	export class Index<
		Origin,
		Key extends ArrayPropKeyIn<Origin>
	> extends PathSymbol<Origin, Key> {
		clone() {
			return new Index<Origin, Key>(this.inProperty) as this
		}

		get wildcardPattern() {
			return new RegExp(`${Pattern.IndexElement.source}|\\${WildcardString}`)
		}

		override get pattern() {
			return Pattern.IndexElement
		}
	}
}

/**
 * Represents a complete Datasworn ID, consisting of one or more type prefixes
 * @template CurrentNode The type of the current (last) node in an IdPattern. Used to provide typechecks for keys when chaining `add` methods.
 */
class IdPattern<
	CurrentNode = Datasworn.RulesPackage
> extends Array<PathFormat> {
	static readonly TypeSep = '\\' + TypeSep

	static readonly PrefixSep = PrefixSep

	static readonly PathSep = '\\' + PathKeySep

	static readonly WILDCARD = '\\' + WildcardString
	static readonly GLOBSTAR = IdPattern.WILDCARD + IdPattern.WILDCARD

	/**
	 * Get the left side of the ID pattern: the type prefix.
	 * @example `oracle_rollable`
	 * @example `move_category`
	 * @example `asset.ability.move`
	 */
	getLeftSide(): RegExp {
		return new RegExp(this.map(({ typeId }) => typeId).join(IdPattern.TypeSep))
	}

	get fullTypeId() {
		return this.map(({ typeId }) => typeId).join(TypeSep)
	}

	/**
	 * Get the right hand side of the ID pattern: the path.
	 * @example `starforged/core/action`
	 * @example `classic/suffer`
	 * @example `classic/ritual/commune.0.commune`
	 */
	getRightSide(
		groups: RegexGroupType = 'named_capture_group',
		wildcard = false
	): RegExp {
		const result = this.map((part) =>
			part.toRegexSource(groups, wildcard)
		).join(IdPattern.TypeSep)

		return new RegExp(result)
	}

	/**
	 * Return a new copy of this IdPattern.
	 * @param primaryTypeId An optional override for the typeId of the *last* PathFormat.
	 */
	clone(primaryTypeId?: string) {
		return new IdPattern(
			...this.map((el, i, arr) =>
				typeof primaryTypeId === 'string' && i === arr.length - 1
					? el.clone(primaryTypeId)
					: el.clone()
			)
		) as this
	}

	/** The type ID of the most recent primary node ancestor. */
	get primaryTypeId() {
		return this.at(0)?.typeId ?? null
	}

	/** The type of the node itself. */
	get nodeTypeId() {
		return this.at(-1)?.typeId ?? null
	}

	get current() {
		return (this.at(-1) as PathFormat<CurrentNode>) ?? null
	}

	get isEmbedded() {
		// if there's more than one path format, it's a multi-part path, and therefore an embedded ID
		return this.length > 1
	}

	createEmbedded<T extends TypeId.Embeddable>(
		typeId: T
	): IdPattern<Extract<TypeNode.Embedded, { type: typeof typeId }>> {
		const withGroup = this.clone().addNewTypeGroup(typeId)

		switch (TypeId.getEmbeddedPropertyType(typeId)) {
			case 'array':
				return withGroup.addIndex(TypeId.getEmbeddedPropertyKey(typeId) as any)

			case 'dictionary':
				return withGroup.addDictKey(
					TypeId.getEmbeddedPropertyKey(typeId) as any
				)

			default:
				throw new Error(
					`Expected an embeddable TypeId, but got ${String(typeId)}`
				)
		}
	}

	addNewTypeGroup(typeId: string) {
		this.push(new PathFormat(typeId))
		return this
	}

	addDictKey<Key extends DictPropKeyIn<CurrentNode>>(inProperty: Key) {
		this.current.addDictKey(inProperty)
		return this as IdPattern<CurrentNode[Key][keyof CurrentNode[Key]]>
	}

	addRecursiveDictKeys<
		Prop extends DictPropKeyIn<CurrentNode>,
		RecursiveProp extends DictPropKeyIn<
			CurrentNode[Prop][keyof CurrentNode[Prop]]
		>
	>(property: Prop, recursiveProperty: RecursiveProp) {
		this.current.addRecursiveDictKeys(property, recursiveProperty)
		return this as IdPattern<EntryInProp<CurrentNode, Prop>>
	}

	addIndex<Prop extends ArrayPropKeyIn<CurrentNode>>(inProperty: Prop) {
		this.current.addIndex<Prop>(inProperty)

		return this as IdPattern<EntryInProp<CurrentNode, Prop>>
	}

	toRegex(
		lineDelimiters = false,
		groups: RegexGroupType = 'named_capture_group',
		wildcard = false
	) {
		const base =
			this.getLeftSide().source +
			IdPattern.PrefixSep +
			this.getRightSide(groups, wildcard).source
		if (lineDelimiters) return new RegExp('^' + base + '$')
		return new RegExp(base)
	}

	toWildcardSchema(options: StringOptions = {}) {
		const typeName = this.fullTypeId.split(TypeSep).map(pascalCase).join('')
		const $id = typeName + 'IdWildcard'
		const description = `A wildcarded ${typeName}Id that can be used to match multiple ${typeName} objects.`
		// named capture groups aren't universally available, so JSON schema docs recommend against using them
		const pattern = this.toRegex(true, 'capture_group', true).source

		return Type.String({
			$id,
			description,
			pattern,
			...options
		})
	}

	toSchema(options: StringOptions = {}) {
		const typeName = this.fullTypeId.split(TypeSep).map(pascalCase).join('')
		const indefiniteArticle = typeName.match(/^[aeiou]/i) ? 'an' : 'a'
		const $id = typeName + 'Id'
		const description = `A unique ID representing ${indefiniteArticle} ${typeName} object.`
		// named capture groups aren't universally available, so JSON schema docs recommend against using them
		const pattern = this.toRegex(true, 'capture_group').source

		return Type.String({
			$id,
			description,
			pattern,
			...options
		})
	}

	static fromRoot(typeId: string) {
		const f = new PathFormat(typeId, true)
		return new IdPattern(f)
	}

	constructor(...formats: PathFormat[]) {
		super()
		this.push(...formats)
	}

	static createCollection<T extends TypeId.Collection>(
		typeId: T,
		typeRoot: TypeId.BranchKey<T>
	) {
		return (
			IdPattern.fromRoot(typeId)
				// @ts-expect-error this happens because not all union members of OracleCollection have the 'collections' property
				.addRecursiveDictKeys(typeRoot, CollectionsKey) as IdPattern<
				TypeNode.Collection<T>
			>
		)
	}

	static createCollectable<T extends TypeId.Collectable>(
		typeId: T,
		typeRoot: TypeId.BranchKey<T>
	) {
		return (
			IdPattern.fromRoot(typeId)
				// @ts-expect-error
				.addRecursiveDictKeys(typeRoot, CollectionsKey)
				// @ts-expect-error
				.addDictKey(ContentsKey) as IdPattern<TypeNode.Collectable<T>>
		)
	}

	static createNonCollectable<T extends TypeId.NonCollectable>(
		typeId: T,
		typeRoot: TypeId.BranchKey<T>
	) {
		return IdPattern.fromRoot(typeId).addDictKey(typeRoot) as IdPattern<
			TypeNode.NonCollectable<T>
		>
	}
}

/**
 * Represents a slash-separated path in a Datasworn ID.
 * @template Origin The object type of the origin for this path.
 */
class PathFormat<Origin = Datasworn.RulesPackage> extends Array<
	PathSymbol<any>
> {
	typeId: string

	get #patterns() {
		return this.map(({ pattern }) => pattern.source)
	}

	toRegexSource(group?: RegexGroupType, wildcard = false) {
		let base = ''
		let dictKeys: PathSymbol.DictKey<any, any>[] = []
		const isOnlyPart = this.length === 1

		// TODO: apply globstar *after*?, rather then in the static prop WILDCARD?

		for (let i = 0; i < this.length; i++) {
			const part = this[i]
			const nextPart = this[i + 1]
			const isFirstPart = i === 0

			switch (true) {
				case isOnlyPart &&
					part instanceof PathSymbol.DictKey &&
					!(part instanceof PathSymbol.RecursiveDictKeys):
					base += part.pattern.source + '|' + IdPattern.WILDCARD // single-symbol paths can't be globstarred
					break
				case part instanceof PathSymbol.DictKey &&
					nextPart instanceof PathSymbol.DictKey:
					// DictKey chain not done; grab the current one and continue
					dictKeys.push(part)
					break
				case part instanceof PathSymbol.DictKey &&
					!(nextPart instanceof PathSymbol.DictKey): {
					// end of this DictKey chain; assemble complete DictKey string, and reset array
					dictKeys.push(part)
					const { min, max } = PathSymbol.DictKey.reduceReps(...dictKeys)
					const toAppend = PathSymbol.DictKey.renderDictKeys(
						min,
						max,
						wildcard
					).source
					if (
						!toAppend.startsWith(`(?:${IdPattern.PathSep}`) &&
						toAppend.length > 0
					)
						base += IdPattern.PathSep
					// if (min > 0 && max > 2) {
					// 	toAppend = toAppend.replace(
					// 		`|${IdPattern.GLOBSTAR})`,
					// 		`|(?:${IdPattern.GLOBSTAR}){${min === max ? min - 1 : min - 1 + ',' + (max - 1)}})`
					// 	)
					// }
					base += toAppend
					dictKeys = []
					break
				}
				default:
					// standard handling
					if (!isFirstPart) base += IdPattern.PathSep
					base += wildcard ? part.wildcardPattern.source : part.pattern.source
					break
			}
		}

		// if (canBeGlobstar) {
		// 	const maxWildcardsAfterInitialGlobstar = this.length - 1
		// 	const extraWildcards =
		// 		maxWildcardsAfterInitialGlobstar === 1
		// 			? `(?:${IdPattern.PathSep}${IdPattern.WILDCARD})?`
		// 			: maxWildcardsAfterInitialGlobstar > 1
		// 				? `(?:${IdPattern.PathSep}${IdPattern.WILDCARD}){0,${maxWildcardsAfterInitialGlobstar}}`
		// 				: ''
		// 	// valid to represent the whole fragment
		// 	base = `${base}|${IdPattern.GLOBSTAR}${extraWildcards}`
		// }

		switch (group) {
			case 'capture_group':
				base = `(${base})`
				break
			case 'non_capturing_group':
				base = `(?:${base})`
				break
			case 'named_capture_group':
				base = `(?<${this.typeId}>${base})`
				break
			case 'none':
			default:
				// if (canBeGlobstar) base = `(?:${base})`
				break
		}
		// Lone globstar is valid for any ID type (to match all IDs of the same type)

		return base
	}

	readonly relative: boolean

	constructor(typeId: string, relative = false) {
		super()
		if (relative) this.push(new PathSymbol.RulesPackage())
		this.relative = relative
		this.typeId = typeId
	}

	clone(newTypeId?: string) {
		const clone = new PathFormat(newTypeId ?? this.typeId, this.relative)
		for (const part of this) {
			if (part instanceof PathSymbol.RulesPackage) continue
			clone.push(part.clone())
		}
		return clone as this
	}

	createRelativeAs(newTypeId: string) {
		return new PathFormat(newTypeId, true) as typeof this
	}

	addDictKey<Prop extends DictPropKeyIn<Origin>>(inProperty: Prop) {
		this.push(new PathSymbol.DictKey<Origin, Prop>(inProperty))
		return this as PathFormat<Origin[Prop][keyof Origin[Prop]]>
	}

	addRecursiveDictKeys<
		Prop extends DictPropKeyIn<Origin>,
		RecursiveProp extends DictPropKeyIn<EntryInProp<Origin, Prop>>
	>(property: Prop, recursiveProperty: RecursiveProp) {
		this.push(
			new PathSymbol.RecursiveDictKeys<Origin, Prop, RecursiveProp>(
				property,
				recursiveProperty
			)
		)
		return this as PathFormat<EntryInProp<Origin, Prop>>
	}

	addIndex<Prop extends ArrayPropKeyIn<Origin>>(inProperty: Prop) {
		this.push(new PathSymbol.Index<Origin, Prop>(inProperty))
		return this as PathFormat<EntryInProp<Origin, Prop>>
	}
}

const patternIndex = {} as Record<TypeId.Any, IdPattern[]>

for (const typeId of TypeId.Primary) {
	let pattern: IdPattern

	switch (true) {
		case TypeGuard.CollectionType(typeId):
			pattern = IdPattern.createCollection(typeId, TypeId.getBranchKey(typeId))
			break

		case TypeGuard.CollectableType(typeId):
			pattern = IdPattern.createCollectable(typeId, TypeId.getBranchKey(typeId))
			break

		case TypeGuard.NonCollectableType(typeId):
			pattern = IdPattern.createNonCollectable(
				typeId,
				TypeId.getBranchKey(typeId)
			)
			break
		default:
			throw new Error(`Expected a primary type, got ${JSON.stringify(typeId)}`)
	}

	patternIndex[typeId] ||= []
	patternIndex[typeId].push(pattern)

	if (TypeId.canHaveEmbed(typeId)) computeEmbeddedTypes(pattern)
}

function computeEmbeddedTypes(pattern: IdPattern) {
	const nodeTypeId = pattern.nodeTypeId as TypeId.Any

	if (!TypeId.canHaveEmbed(nodeTypeId, pattern.isEmbedded)) return

	const embedTypes = TypeId.getEmbeddableTypes(nodeTypeId, pattern.isEmbedded)

	for (const embedType of embedTypes) {
		const embedPattern = pattern.createEmbedded(embedType)

		patternIndex[embedType] ||= []
		patternIndex[embedType].push(embedPattern)

		computeEmbeddedTypes(embedPattern)
	}
}

// patterns.sort((a, b) =>
// a.getLeftSide().source.localeCompare(b.getLeftSide().source, 'en-US'))

type PrimaryNodePrefix<T extends TypeId.Primary = TypeId.Primary> =
	`${PascalCase<T>}`
type EmbeddedPrimaryNodePrefix<
	T extends TypeId.EmbeddablePrimary = TypeId.EmbeddablePrimary
> = `Embedded${PascalCase<T>}`
type PrimaryNodeUnionPrefix<
	T extends TypeId.EmbeddablePrimary = TypeId.EmbeddablePrimary
> = `Any${PascalCase<T>}`
type EmbedOnlyPrefix<
	T extends TypeId.EmbedOnly = TypeId.EmbedOnly,
	TParent extends TypeId.CanEmbedType<T> = TypeId.CanEmbedType<T>
> = `${PascalCase<TParent>}${PascalCase<T>}`

type IdSuffix = 'Id' | 'IdWildcard'

type IdSchemaName =
	`${EmbeddedPrimaryNodePrefix | PrimaryNodePrefix | PrimaryNodeUnionPrefix | EmbedOnlyPrefix | 'Any'}${IdSuffix}`

const ids = {} as Record<IdSchemaName, TString | TUnion<TRef<string>[]>>

for (const typeId in patternIndex) {
	const typePatterns = patternIndex[typeId as TypeId.Any]

	for (const pattern of typePatterns)
		for (const schema of [pattern.toSchema(), pattern.toWildcardSchema()]) {
			ids[schema.$id as IdSchemaName] = schema
		}
}

const permutations = {} as Record<string, Set<string>>

function permutate(typeId: TypeId.Any, parentTypeComposite: string) {
	if (TypeId.isPrimary(typeId) && !TypeId.isEmbedOnly(parentTypeComposite)) {
		const typeSchema = pascalCase(typeId) + 'Id'

		const parentTypePrefix = parentTypeComposite
			.split(TypeSep)
			.map(pascalCase)
			.join('')

		const thisSchema = parentTypePrefix + typeSchema
		const thisWildcardSchema = thisSchema + 'Wildcard'

		const anySchema = `Any` + typeSchema
		const anyWildcardSchema = anySchema + 'Wildcard'
		const embeddedSchema = `Embedded` + typeSchema
		const embeddedWildcardSchema = embeddedSchema + 'Wildcard'

		permutations[anySchema] ||= new Set([typeSchema])
		permutations[embeddedWildcardSchema] ||= new Set()
		permutations[embeddedSchema] ||= new Set()
		permutations[anyWildcardSchema] ||= new Set([typeSchema + 'Wildcard'])

		permutations[anySchema].add(thisSchema)
		permutations[anyWildcardSchema].add(thisWildcardSchema)

		permutations[embeddedSchema].add(thisSchema)
		permutations[embeddedWildcardSchema].add(thisWildcardSchema)
	}

	const embeddedTypes = TypeId.getEmbeddableTypes(typeId, true)

	for (const embeddedTypeId of embeddedTypes)
		permutate(embeddedTypeId, `${parentTypeComposite}${TypeSep}${typeId}`)
}

for (const primaryTypeId in TypeId.EmbedTypeMap) {
	const embeddedTypeIds = TypeId.EmbedTypeMap[primaryTypeId as TypeId.Embedding]

	for (const embeddedTypeId of embeddedTypeIds)
		permutate(embeddedTypeId, primaryTypeId)
}

const anyIdSchemata: TRef<string>[] = []
const anyIdWildcardSchemata: TRef<string>[] = []

for (const $id in permutations) {
	const schemaIds = Array.from(permutations[$id]).map((id) =>
		Type.Ref(id)
	)
	ids[$id as IdSchemaName] = Type.Union(schemaIds, {
		$id,
		[JsonTypeDef]: { schema: JtdType.String() }
	})
	if ($id.endsWith('IdWildcard')) anyIdWildcardSchemata.push(...schemaIds)
	else anyIdSchemata.push(...schemaIds)
}

// @ts-expect-error
ids.AnyOracleRollableRowId = Type.Union(
	Object.values(ids)
		.filter((schema) => schema.$id?.endsWith('OracleRollableRowId'))
		.map((schema) => Type.Ref(schema.$id as string)),
	{
		$id: 'AnyOracleRollableRowId',
		[JsonTypeDef]: { schema: JtdType.String() }
	}
)
// @ts-expect-error

ids.AnyOracleRollableRowIdWildcard = Type.Union(
	Object.values(ids)
		.flat()
		.filter((schema) => schema.$id?.endsWith('OracleRollableRowIdWildcard'))
		.map((schema) => Type.Ref(schema.$id as string)),
	{
		$id: 'AnyOracleRollableRowIdWildcard',
		[JsonTypeDef]: { schema: JtdType.String() }
	}
)
// @ts-expect-error

ids.AnyId = Type.Union(
	Object.values(ids)
		.flat()
		.filter(
			(schema) =>
				schema.type === 'string' && !schema.$id?.endsWith('IdWildcard')
		)
		.map((schema) => Type.Ref(schema)),
	{
		$id: 'AnyId',
		description:
			'Represents any kind of non-wildcard ID, including IDs of embedded objects.',
		[JsonTypeDef]: { schema: JtdType.String() }
	}
)
// @ts-expect-error

ids.AnyIdWildcard = Type.Union(
	Object.values(ids)
		.flat()
		.filter(
			(schema) => schema.type === 'string' && schema.$id?.endsWith('IdWildcard')
		)
		.map((schema) => Type.Ref(schema)),
	{
		$id: 'AnyIdWildcard',
		description:
			'Represents any kind of wildcard ID, including IDs of embedded objects.',
		[JsonTypeDef]: { schema: JtdType.String() }
	}
)

// generate union types from IDs that are marked Any*Id

const idUnionNamePattern = /^Any(?<typeName>[A-Z][A-z]+)Id$/

for (const idName in ids) {
	const match = idName.match(idUnionNamePattern)
	if (!match?.groups) continue
	const { typeName } = match.groups
	const typeId = snakeCase(typeName) as TypeId.Any
	if (!TypeId.isPrimary(typeId)) continue

	const $id = `Any${typeName}` as keyof typeof ids
	ids[$id] = Type.Union([Type.Ref(typeName), Type.Ref(`Embedded${typeName}`)], {
		$id,
		[JsonTypeDef]: { skip: true }
	})
}

export default ids
