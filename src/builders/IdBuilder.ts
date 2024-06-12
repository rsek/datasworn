import {
	Type,
	type StringOptions,
	type TString,
	type TUnion
} from '@sinclair/typebox'
import type TypeNode from '../pkg-core/TypeNode.js'
import CONST from '../pkg-core/IdElements/CONST.js'
import TypeId from '../pkg-core/IdElements/TypeId.js'
import Pattern from '../pkg-core/IdElements/Pattern.js'
import type { Datasworn } from '../pkg-core/index.js'
import { pascalCase } from '../schema/utils/string.js'
import type { Join, PascalCase, Split } from 'type-fest'

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

type EntryInProp<O, P extends DictPropKeyIn<O> | ArrayPropKeyIn<O>> =
	O[P] extends Array<any> ? O[P][number] : O[P][keyof O[P]]

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
			`(?:${Pattern.RulesPackageElement.source}|\\${CONST.WildcardString}|\\${CONST.WildcardString}\\${CONST.WildcardString})`
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

	export class DictKey<Origin, Prop extends DictPropKeyIn<Origin>> extends PathSymbol<
		Origin,
		Prop
	> {
		static readonly PATTERN = Pattern.DictKeyElement
		static readonly WILDCARD = new RegExp(
			`${DictKey.PATTERN.source}|\\${CONST.PathKeySep}\\${CONST.WildcardString}|\\${CONST.PathKeySep}\\${CONST.WildcardString}\\${CONST.WildcardString}`
		)

		public get minReps(): number {
			return CONST.RECURSIVE_PATH_ELEMENTS_MIN
		}

		public get maxReps(): number {
			return CONST.RECURSIVE_PATH_ELEMENTS_MIN
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

			let wrappedKey = `(?:${base}){${minMax}}`

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

				variants.push(variantParts.join(CONST.PathKeySep))

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
			return CONST.RECURSIVE_PATH_ELEMENTS_MIN
		}

		override get maxReps() {
			return CONST.RECURSIVE_PATH_ELEMENTS_MAX
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
			return new RegExp(
				`${Pattern.IndexElement.source}|\\${CONST.WildcardString}`
			)
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
	static readonly PathTypeSep = '\\' + CONST.PathTypeSep

	static readonly PrefixSep = CONST.PrefixSep

	static readonly PathSep = '\\' + CONST.PathKeySep

	static readonly WILDCARD = '\\' + CONST.WildcardString
	static readonly GLOBSTAR = IdPattern.WILDCARD + IdPattern.WILDCARD

	/**
	 * Get the left side of the ID pattern: the type prefix.
	 * @example `oracle_rollable`
	 * @example `move_category`
	 * @example `asset.ability.move`
	 */
	getLeftSide(): RegExp {
		return new RegExp(
			this.map(({ typeId }) => typeId).join(IdPattern.PathTypeSep)
		)
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
		).join(IdPattern.PathTypeSep)

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

	get primaryTypeId() {
		return this.at(-1)?.typeId ?? null
	}

	get current() {
		return (this.at(-1) as PathFormat<CurrentNode>) ?? null
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
		const typeName = this.map((item) => pascalCase(item.typeId)).join('')
		const indefiniteArticle = typeName.match(/^[aeiou]/i) ? 'an' : 'a'
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
		const typeName = this.map((item) => pascalCase(item.typeId)).join('')
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
		typeRoot: TypeId.RootKey<T>
	) {
		return (
			IdPattern.fromRoot(typeId)
				// @ts-expect-error this happens because not all union members of OracleCollection have the 'collections' property
				.addRecursiveDictKeys(typeRoot, CONST.CollectionsKey) as IdPattern<
				TypeNode.ByType<T>
			>
		)
	}

	static createCollectable<T extends TypeId.Collectable>(
		typeId: T,
		typeRoot: TypeId.RootKey<T>
	) {
		return (
			IdPattern.fromRoot(typeId)
				// @ts-expect-error
				.addRecursiveDictKeys(typeRoot, CONST.CollectionsKey)
				// @ts-expect-error
				.addDictKey(CONST.ContentsKey) as IdPattern<TypeNode.ByType<T>>
		)
	}

	static createNonCollectable<T extends TypeId.NonCollectable>(
		typeId: T,
		typeRoot: TypeId.RootKey<T>
	) {
		return IdPattern.fromRoot(typeId).addDictKey(typeRoot) as IdPattern<
			TypeNode.ByType<T>
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

const patterns: IdPattern[] = []

for (const k of TypeId.Collection) {
	const key = k as TypeId.Collection
	const pattern = IdPattern.createCollection(key, TypeId.getRootKey(key))

	patterns.push(pattern)
}

for (const k of TypeId.Collectable) {
	const key = k as TypeId.Collectable
	const pattern = IdPattern.createCollectable(key, TypeId.getRootKey(key))

	patterns.push(pattern)
}
for (const k of TypeId.NonCollectable) {
	const key = k as TypeId.NonCollectable
	const pattern = IdPattern.createNonCollectable(key, TypeId.getRootKey(key))

	patterns.push(pattern)
}

const embeddedIdNames: Record<TypeId.AnyPrimary, string[]> = {}

function extendForEmbed(
	base: IdPattern,
	embeddedTypeId: TypeId.AnyPrimary | TypeId.EmbedOnlyTypes
) {
	let newPattern = base.clone().addNewTypeGroup(embeddedTypeId)

	if (embeddedTypeId in TypeId.RootKeys) {
		newPattern = newPattern.addDictKey(
			TypeId.getRootKey(embeddedTypeId as TypeId.AnyPrimary)
		)
		embeddedIdNames[embeddedTypeId] ||= []
		embeddedIdNames[embeddedTypeId].push(
			base.map(({ typeId }) => pascalCase(typeId)).join('')
		)

		return newPattern
	}

	switch (embeddedTypeId as TypeId.EmbedOnlyTypes) {
		case 'ability':
		case 'option':
			// @ts-expect-error
			return newPattern.addIndex(
				TypeId.EmbeddedPropertyKeys[embeddedTypeId as TypeId.EmbedOnlyTypes]
			)

		default:
			throw new Error(
				`Couldn't determine property for embedded type "${embeddedTypeId}"`
			)
	}
}

for (const compositeTypeId of TypeId.EmbeddedTypePaths) {
	const [parentTypeId, typeId] = compositeTypeId.split('.') as Split<
		typeof compositeTypeId,
		'.'
	>

	const parentPattern = patterns.find(
		(pattern) => pattern[0].typeId === parentTypeId
	) as IdPattern<TypeNode.ByType<typeof parentTypeId>>

	if (parentPattern == null)
		throw new Error(`Couldn't find parent IdPattern of type "${parentTypeId}"`)

	const embeddedPattern = extendForEmbed(parentPattern, typeId)
	patterns.push(embeddedPattern)

	const childTypeIds = TypeId.EmbedOfEmbedTypePaths.filter((t) =>
		t.startsWith(compositeTypeId)
	)

	if (childTypeIds.length === 0) continue

	for (const childTypeIdComposite of childTypeIds) {
		const [_parentTypeId, _typeId, childTypeId] = childTypeIdComposite.split(
			'.'
		) as Split<typeof childTypeIdComposite, '.'>
		const childPattern = extendForEmbed(embeddedPattern, childTypeId)
		patterns.push(childPattern)
	}
}

type IdSchemaName =
	`${PascalCase<Join<Split<TypeId.Any, '.'>, '_'>>}${'Id' | 'IdWildcard'}`

const ids = {} as Record<IdSchemaName, TString>

for (const pattern of patterns.sort((a, b) =>
	a.getLeftSide().source.localeCompare(b.getLeftSide().source, 'en-US')
)) {
	for (const schema of [pattern.toSchema(), pattern.toWildcardSchema()])
		ids[schema.$id as PascalCase<IdSchemaName>] = schema
}

// generate unions for embedded types, and Any*Id for their base types
for (const typeId in embeddedIdNames) {
	const unionTypes = embeddedIdNames[typeId]
	if (unionTypes.length === 0) continue
	const baseTypeId = `${pascalCase(typeId)}Id`
	const embeddedTypeId = `Embedded${baseTypeId}`
	const anyTypeId = `Any${baseTypeId}`

	ids[embeddedTypeId] = Type.Union(
		unionTypes.map((parentType) => Type.Ref(parentType + baseTypeId)),
		{
			$id: embeddedTypeId
		}
	)
	ids[embeddedTypeId + 'Wildcard'] = Type.Union(
		unionTypes.map((parentType) =>
			Type.Ref(parentType + baseTypeId + 'Wildcard')
		),
		{
			$id: embeddedTypeId + 'Wildcard'
		}
	)

	ids[anyTypeId] = Type.Union(
		[Type.Ref(embeddedTypeId), Type.Ref(baseTypeId)],
		{ $id: anyTypeId }
	)
	ids[anyTypeId + 'Wildcard'] = Type.Union(
		[Type.Ref(embeddedTypeId + 'Wildcard'), Type.Ref(baseTypeId + 'Wildcard')],
		{ $id: anyTypeId + 'Wildcard' }
	)
}

const idTypes: string[] = []
const wildcardIdTypes: string[] = []
for (const idTypeName in ids) {
	const idType = ids[idTypeName] as TUnion | TString

	// skip things that are already a union
	if (idType.type !== 'string') continue

	if (idTypeName.endsWith('Wildcard')) wildcardIdTypes.push(idTypeName)
	else idTypes.push(idTypeName)
}

ids['AnyId'] = Type.Union(
	idTypes.map((idType) => Type.Ref(idType)),
	{
		$id: 'AnyId',
		description:
			'Represents any kind of non-wildcard ID, including IDs of embedded objects.'
	}
)
ids['AnyIdWildcard'] = Type.Union(
	wildcardIdTypes.map((idType) => Type.Ref(idType)),
	{
		$id: 'AnyIdWildcard',
		description:
			'Represents any kind of wildcard ID, including IDs of embedded objects.'
	}
)

export default ids