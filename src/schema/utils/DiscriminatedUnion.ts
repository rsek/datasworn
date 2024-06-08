import {
	CloneType,
	Kind,
	Type,
	TypeRegistry,
	type SchemaOptions,
	type Static,
	type TLiteral,
	type TObject,
	type TProperties,
	type TSchema,
	type TUnion,
	type TRef,
	type ObjectOptions
} from '@sinclair/typebox'
import { keyBy, omit } from 'lodash-es'
import { Discriminator, Mapping, Members } from '../Symbols.js'
import { type TIfThenElse } from './IfThen.js'
import { UnionEnum, type TUnionEnum } from './UnionEnum.js'
import type {
	OracleCollection,
	OracleRollable,
	OracleTableText,
	OracleTableText2,
	OracleTableText3,
	TOracleTableText
} from '../Oracles.js'
import type { PickByType } from './typebox.js'
import { IfThenElse } from './IfThen.js'

type DiscriminableKeyOf<T> = keyof T & keyof PickByType<T, string> & string
type DiscriminatorValueOf<T, D extends DiscriminableKeyOf<T>> = T[D] & string
export type DiscriminatorMap<T, D extends DiscriminableKeyOf<T>> = {
	[K in T as DiscriminatorValueOf<T, D>]: K
}

type ValueIn<T extends Record<any, TSchema>> =
	T extends Record<any, infer U extends TSchema> ? U : never

export type TDiscriminable<T extends TObject = TObject> = T | TRef<T>

export type TDiscriminableBy<
	T extends TObject,
	D extends string,
	V extends string = string
> = TObject<T['properties'] & { [K in D]: TLiteral<V> }>

export type TDiscriminableKeyOf<T extends TDiscriminable> = DiscriminableKeyOf<
	Static<T>
>

export type TDiscriminableKeyFor<T extends TDiscriminatorMap<TDiscriminable>> =
	keyof Static<ValueIn<T>> & string

type TDiscriminatorValueOf<
	T extends TDiscriminable,
	D extends TDiscriminableKeyOf<T>
> = Static<T[D]>

type TDiscriminatorValueFor<
	T extends TDiscriminatorMap<TDiscriminable>,
	D extends TDiscriminableKeyFor<T>
> = Static<T[keyof T] & TSchema>[D]

export type TDiscriminatorMap<
	T extends TDiscriminable = TDiscriminable,
	D extends TDiscriminableKeyOf<T> = TDiscriminableKeyOf<T>
> = Record<D, T & TDiscriminable>
// > = {
// 	[Schema in T as Static<T>[D] & string]: Schema
// }TDiscriminatedUnion

// type TDiscriminatorMap<D extends string, V extends string = string> = {
// 	[K in V]: TDiscriminable<D, K>
// }

export interface TDiscriminatedUnion<
	M extends TDiscriminatorMap<TDiscriminable>,
	D extends TDiscriminableKeyFor<M> = TDiscriminableKeyFor<M>
> extends TSchema {
	type: 'object'
	static: Static<TUnion<ValueIn<M>[]>>

	properties: Record<D, TUnionEnum<(Static<M[keyof M]>[D] & string)[]>>

	// without this, schemata won't validate if they add any new properties (which they almost certainly will)
	additionalProperties: true

	allOf: TIfThenElse<
		TObject<{ [K in D]: TDiscriminatorValueOf<ValueIn<M>, D> }>,
		ValueIn<M>
	>[]

	[Kind]: 'DiscriminatedUnion'
	[Discriminator]: D
	[Mapping]: M
}

export type TDiscriminatorMappingOf<
	T extends TDiscriminatedUnion<TDiscriminatorMap<TDiscriminable>>
> = T[typeof Mapping]

export type TDiscriminatedMemberType<T extends TDiscriminatedUnion<any>> =
	T extends TDiscriminatedUnion<
		infer U extends TDiscriminatorMap<TDiscriminable>,
		any
	>
		? keyof U
		: never

export type TDiscriminatedMember<
	T extends TDiscriminatedUnion<any>,
	TMemberType extends TDiscriminatedMemberType<T> = TDiscriminatedMemberType<T>
> = T extends TDiscriminatedUnion<infer U> ? U[TMemberType] : never

export function Discriminable<
	D extends string,
	V extends string,
	Base extends TObject = TObject
>(base: Base, discriminator: D, mappingKey: V, options = {}) {
	const newProps = {
		...CloneType(base, options).properties,
		[discriminator]: Type.Literal(mappingKey)
	} as Base['properties'] & { [P in D]: TLiteral<V> }

	return Type.Object(newProps, options)
}

export function DiscriminatedUnion<
	M extends TDiscriminatorMap<TDiscriminable<TObject>>,
	D extends string & keyof Static<ValueIn<M>>
>(mapping: M, discriminator: D, options: SchemaOptions = {}) {
	if (!TypeRegistry.Has('DiscriminatedUnion'))
		TypeRegistry.Set('DiscriminatedUnion', DiscriminatedUnionCheck)

	const allOf = Object.entries(mapping).map(
		([value, schema]: [TDiscriminatorValueFor<M>, M[keyof M]]) =>
			Discriminated(
				'$id' in schema ? Type.Ref(schema) : schema,
				discriminator,
				value
			)
	)
	const discriminatorValues = UnionEnum(Object.keys(mapping))

	return {
		...options,
		properties: { [discriminator]: discriminatorValues },
		additionalProperties: true,
		allOf,
		required: [discriminator],
		type: 'object',
		remarks: `Deserialize as a discriminated union/polymorphic object type, using the \`${discriminator}\` property as a discriminator.`,

		[Discriminator]: discriminator,
		[Mapping]: mapping,

		[Kind]: 'DiscriminatedUnion'
	} as unknown as TDiscriminatedUnion<M, D>
}

export function OmitDiscriminatedUnionMembers<
	TBase extends TDiscriminatedUnion<TDiscriminatorMap<TDiscriminable>>,
	TOmitKeys extends (keyof TBase[typeof Mapping])[]
>(base: TBase, omitKeys: TOmitKeys, options: ObjectOptions = {}) {
	const remapping = {} as Omit<TBase[typeof Mapping], TOmitKeys[number]>

	for (const k in base[Mapping])
		if (!omitKeys.includes(k as any))
			// @ts-expect-error
			remapping[k] = base[Mapping][k]

	return DiscriminatedUnion(
		remapping,
		base[Discriminator],
		options
	) as TOmitDiscriminatedUnionMembers<TBase, TOmitKeys>
}
export type TOmitDiscriminatedUnionMembers<
	TBase extends TDiscriminatedUnion<TDiscriminatorMap<TDiscriminable>>,
	TOmitKeys extends (keyof TBase[typeof Mapping])[]
> = TDiscriminatedUnion<
	Omit<TBase[typeof Mapping], TOmitKeys[number]>,
	TBase[typeof Discriminator]
>


function DiscriminatedUnionCheck(
	schema: TDiscriminatedUnion<
		TDiscriminatorMap<TDiscriminable>,
		TDiscriminableKeyFor<unknown>
	>,
	value: unknown
) {
	const discriminator = schema[Discriminator]
	// const members = schema[Members]
	const mapping = schema.properties[discriminator].enum

	// const memberSchema = UnionOneOf(members)
	// const memberValidator = Value.Check()

	return (value as any[]).every((item) => mapping.includes(item[discriminator]))
}

export function TDiscriminatedUnion<
	T extends TDiscriminatedUnion<TObject[], string> = TDiscriminatedUnion<
		TObject[],
		string
	>
>(schema: unknown): schema is T {
	return (schema as T)[Kind] === 'DiscriminatedUnion'
}

export function ToUnion<T extends TObject[]>(
	schema: TDiscriminatedUnion<T, string>
) {
	const base = omit(CloneType(schema), [
		'type',
		'allOf',
		'additionalProperties',
		'oneOf',
		Kind,
		Discriminator,
		Members
	])

	const anyOf = schema.allOf.map(({ then }) => then) as T

	return Type.Union(anyOf, omit(base, ['properties']))
}

function Discriminated<
	T extends TSchema,
	K extends keyof Static<T>,
	V extends Static<T>[K] & string
>(schema: T, discriminator: K, value: V, options: SchemaOptions = {}) {
	return {
		...IfThenElse(
			{
				condition: {
					...Type.Object(
						{ [discriminator]: Type.Literal(value) }
						// unset these to reduce schema clutter; they're redundant once the schema is composed
					),
					required: undefined,
					type: undefined
				},
				ifTrue: schema
			},
			options
		),
		required: undefined,
		type: undefined
	}
}

