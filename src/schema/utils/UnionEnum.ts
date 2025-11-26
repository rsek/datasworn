// adapted from https://github.com/sinclairzx81/typebox/blob/master/examples/prototypes/union-enum.ts

import {
	Hint,
	Kind,
	Type,
	CloneType,
	TypeRegistry,
	type SchemaOptions,
	type TEnum,
	type TSchema
} from '@sinclair/typebox'
import { isInteger, omit, set } from 'lodash-es'
import { JsonTypeDef } from '../Symbols.js'

export const EnumDescription = Symbol('EnumDescription')
export const Description = Symbol('Description')

export interface TUnionEnum<
	T extends string[] | number[] | readonly string[] | readonly number[] =
		| string[]
		| number[]
		| readonly string[]
		| readonly number[]
> extends TSchema {
	[Kind]: 'UnionEnum'
	[EnumDescription]: Record<T[number], string>
	[Description]?: string | undefined
	static: T[number]
	enum: [...T]
}

export function UnionEnum<
	T extends string[] | number[] | readonly string[] | readonly number[]
>(literals: T, options: SchemaOptions = {}) {
	if (!TypeRegistry.Has('UnionEnum'))
		TypeRegistry.Set('UnionEnum', UnionEnumCheck)

	const result = {
		...options,
		[Kind]: 'UnionEnum',
		enum: [...literals]
	} as TUnionEnum<T>

	if (result.enum.every(isInteger) && result[JsonTypeDef])
		set(result[JsonTypeDef], 'metadata.typescriptType', literals.join(' | '))
	return result
}

export function TUnionEnum(schema: any): schema is TUnionEnum {
	if (!Array.isArray(schema?.enum)) return false
	return (
		schema.enum.every((item: any) => typeof item === 'string') ||
		schema.enum.every((item: any) => typeof item === 'number')
	)
}

function UnionEnumCheck(
	schema: TUnionEnum<any>,
	value: unknown
) {
	return schema.enum.includes(value as string | number)
}

export function ToEnum<T extends TUnionEnum>(schema: T) {
	const anyOf = schema.enum.map((value) =>
		Type.Literal(value, { description: schema[EnumDescription]?.[value] })
	)
	const options = omit(CloneType(schema), [
		Kind,
		EnumDescription,
		Description,
		'static',
		'enum'
	])

	const result = Type.Union(anyOf, {
		...options,
		description: schema[Description],

		[Hint]: 'Enum'
	}) as unknown as TEnum

	return result
}
