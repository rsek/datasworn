import {
	CloneType,
	Kind,
	Type,
	TypeRegistry,
	type ObjectOptions,
	type SchemaOptions,
	type Static,
	type TLiteral,
	type TObject,
	type TRef,
	type TSchema,
	type TUnion
} from '@sinclair/typebox'
import { omit } from 'lodash-es'
import { Discriminator, Mapping, Members } from '../Symbols.js'
import { Assign, type TAssign } from './FlatIntersect.js'
import { IfThenElse, type TIfThenElse } from './IfThen.js'
import { UnionEnum, type TUnionEnum } from './UnionEnum.js'
import type { PickByType } from './typebox.js'

type DiscriminableKeyOf<T> = keyof T & keyof PickByType<T, string> & string
type DiscriminatorValueOf<T, D extends DiscriminableKeyOf<T>> = T[D] & string
export type DiscriminatorMap<T, D extends DiscriminableKeyOf<T>> = {
	[K in T as DiscriminatorValueOf<T, D>]: K
}

type ValueIn<T extends Record<any, TSchema>> =
	T extends Record<any, infer U extends TSchema> ? U : never

export type TDiscriminableish<
	K extends string = string,
	D extends string = string,
	TBase extends TObject = TObject
> = TDiscriminable<K, D, TBase> | TRef<TDiscriminable<K, D, TBase>>

export function Discriminable<
	K extends string,
	V extends string,
	TBase extends TObject = TObject
>(base: TBase, discriminator: K, mappingKey: V, options = {}) {
	const mixin = Type.Object({
		[discriminator]: Type.Literal(mappingKey)
	}) as TObject<{ [P in K]: TLiteral<V> }>
	return Assign(base, mixin, options) as TDiscriminable<K, V, TBase>
}
export type TDiscriminable<
	K extends string,
	V extends string,
	TBase extends TObject = TObject
> = TAssign<TBase, TObject<{ [P in K]: TLiteral<V> }>>
export type Discriminable<
	K extends string,
	V extends string,
	TBase extends object
> = Assign<TBase, { [P in K]: V }>

export type TDiscriminableBy<
	T extends TObject,
	D extends string,
	V extends string = string
> = TObject<T['properties'] & { [K in D]: TLiteral<V> }>

export type TDiscriminableKeyOf<T extends TDiscriminableish> =
	DiscriminableKeyOf<Static<T>>

export type TDiscriminableKeyFor<
	T extends TDiscriminatorMap<TDiscriminableish>
> = keyof Static<ValueIn<T>> & string

type TDiscriminatorValueOf<
	T extends TDiscriminableish,
	D extends TDiscriminableKeyOf<T>
> = Static<T[D]>

type TDiscriminatorValueFor<
	T extends TDiscriminatorMap<TDiscriminableish>,
	D extends TDiscriminableKeyFor<T>
> = Static<T[keyof T] & TSchema>[D]

export type TDiscriminatorMap<
	T extends TDiscriminableish = TDiscriminableish,
	D extends TDiscriminableKeyOf<T> = TDiscriminableKeyOf<T>
> = Record<D, T & TDiscriminableish>
// > = {
// 	[Schema in T as Static<T>[D] & string]: Schema
// }TDiscriminatedUnion

// type TDiscriminatorMap<D extends string, V extends string = string> = {
// 	[K in V]: TDiscriminable<D, K>
// }

export interface TDiscriminatedUnion<
	M extends TDiscriminatorMap<TDiscriminableish>,
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
	T extends TDiscriminatedUnion<TDiscriminatorMap<TDiscriminableish>>
> = T[typeof Mapping]

export type TDiscriminatedMemberType<T extends TDiscriminatedUnion<any>> =
	T extends TDiscriminatedUnion<
		infer U extends TDiscriminatorMap<TDiscriminableish>,
		any
	>
		? keyof U
		: never

export type TDiscriminatedMember<
	T extends TDiscriminatedUnion<any>,
	TMemberType extends TDiscriminatedMemberType<T> = TDiscriminatedMemberType<T>
> = T extends TDiscriminatedUnion<infer U> ? U[TMemberType] : never

export function DiscriminatedUnion<
	M extends TDiscriminatorMap<TDiscriminableish<string, string, TObject>>,
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
	TBase extends TDiscriminatedUnion<TDiscriminatorMap<TDiscriminableish>>,
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
	TBase extends TDiscriminatedUnion<TDiscriminatorMap<TDiscriminableish>>,
	TOmitKeys extends (keyof TBase[typeof Mapping])[]
> = TDiscriminatedUnion<
	Omit<TBase[typeof Mapping], TOmitKeys[number]>,
	TBase[typeof Discriminator]
>

function DiscriminatedUnionCheck(
	schema: TDiscriminatedUnion<
		TDiscriminatorMap<TDiscriminableish>,
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

