import {
	CloneType,
	type SchemaOptions,
	type TSchema,
	type TArray,
	type TBoolean,
	type TInteger,
	type TIntersect,
	type TLiteral,
	type TNull,
	type TNumber,
	type TObject,
	type TRecord,
	type TRef,
	type TString,
	type TTuple,
	type TUnion,
	type TRegExp
} from '@sinclair/typebox'
import { type TUnionEnum } from '../utils/UnionEnum.js'
import { type TUnionOneOf } from '../utils/UnionOneOf.js'
import { type TDiscriminatedUnion } from '../utils/DiscriminatedUnion.js'
import { type TNullable } from '../Utils.js'

export const SchemaKind = [
	'Array',
	'Boolean',
	'Integer',
	'Intersect',
	'Literal',
	'Null',
	'Number',
	'Object',
	'Record',
	'Ref',
	'String',
	'Tuple',
	'Union',
	'RegExp',
	// custom types
	'UnionOneOf',
	'UnionEnum',
	'DiscriminatedUnion',
	'Nullable'
] as const

interface SchemaKindMap extends Record<SchemaKind, TSchema> {
	Array: TArray
	Boolean: TBoolean
	Integer: TInteger
	Intersect: TIntersect
	Literal: TLiteral
	Null: TNull
	Number: TNumber
	Object: TObject
	Record: TRecord
	Ref: TRef
	String: TString
	Tuple: TTuple
	Union: TUnion
	RegExp: TRegExp
	// custom types
	UnionOneOf: TUnionOneOf<TSchema[]>
	UnionEnum: TUnionEnum
	DiscriminatedUnion: TDiscriminatedUnion<TObject[], string>
	Nullable: TNullable
}

export type SchemaKind = (typeof SchemaKind)[number]

export type SchemaTransform<T> = (schema: T, options: SchemaOptions) => T

export type SchemaTransforms = {
	[P in SchemaKind]: SchemaTransform<SchemaKindMap[P]>
}

export const SchemaTransforms = Object.fromEntries(
	SchemaKind.map((kind) => [
		kind,
		(schema: SchemaKindMap[typeof kind], options: SchemaOptions) =>
			CloneType(schema, options)
	])
) as SchemaTransforms
