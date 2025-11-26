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
	type TRefUnsafe,
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

type ValueIn<T extends Record<any, TSchema>> = T extends Record<
	any,
	infer U extends TSchema
>
	? U
	: never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TDiscriminableish<
	K extends string = string,
	D extends string = string,
	TBase extends TObject = TObject
> = TDiscriminable<K, D, TBase> | TRefUnsafe<TDiscriminable<K, D, TBase>> | TObject<any> | TRefUnsafe<TObject<any>>

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
	M extends TDiscriminatorMap<TDiscriminableish> = TDiscriminatorMap<TDiscriminableish>,
	D extends string = string
> extends TSchema {
	type: 'object'
	static: Static<TUnion<ValueIn<M>[]>>

	properties: Record<D, TUnionEnum<string[]>>

	// without this, schemata won't validate if they add any new properties (which they almost certainly will)
	additionalProperties: true

	allOf: TIfThenElse<
		TObject<{ [K in D]: TDiscriminatorValueOf<ValueIn<M>, any> }>,
		ValueIn<M>
	>[]

	[Kind]: 'DiscriminatedUnion'
	[Discriminator]: D
	[Mapping]: M
}

export type TDiscriminatorMappingOf<
	T extends TDiscriminatedUnion<any, string>
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

	const allOf = (Object.entries(mapping) as [string, TSchema][]).map(
		([value, schema]) =>
			(Discriminated as any)(
				'$id' in schema ? Type.Ref(schema) : schema,
				discriminator,
				value
			)
	)
	const discriminatorValues = UnionEnum(Object.keys(mapping) as string[])

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

	return (DiscriminatedUnion as any)(
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
	TBase[typeof Discriminator] & string
>

function DiscriminatedUnionCheck(
	schema: TDiscriminatedUnion<any, string>,
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
	T extends TDiscriminatedUnion<any, string> = TDiscriminatedUnion<
		any,
		string
	>
>(schema: unknown): schema is T {
	return (schema as T)[Kind] === 'DiscriminatedUnion'
}

export function ToUnion<T extends TObject[]>(
	schema: TDiscriminatedUnion<any, string>
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

	const anyOf = schema.allOf.map(({ then }) => then) as unknown as T

	return Type.Union(anyOf, omit(base, ['properties']))
}

function Discriminated<
	T extends TSchema,
	K extends keyof Static<T>,
	V extends Static<T>[K] & string
>(schema: T, discriminator: K, value: V, options: SchemaOptions = {}) {
	return omit(
		IfThenElse(
			{
				condition: omit(
					Type.Object(
						{ [discriminator]: Type.Literal(value) }
						// unset these to reduce schema clutter; they're redundant once the schema is composed
					),
					['required', 'type']
				) as TObject,
				ifTrue: schema
			},
			options
		),
		['required', 'type']
	)
}
