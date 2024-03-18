import {
	CloneType,
	type TObject,
	type TOptional,
	type TSchema,
	TypeGuard,
	Type,
	type ObjectOptions
} from '@sinclair/typebox'
import { omitBy } from 'lodash-es'
import { type OptionalKeysOf, type ConditionalExcept } from 'type-fest'

export type OmitOptional<T extends object> = Omit<T, OptionalKeysOf<T>>

export type TOmitOptional<T extends TObject> = TObject<
	ConditionalExcept<T['properties'], TOptional<TSchema>>
>
export function OmitOptional<T extends TObject>(
	schema: T,
	options: ObjectOptions = {}
) {
	const base = CloneType(schema)

	base.properties = omitBy(base.properties, (v) => TypeGuard.IsOptional(v))

	return Type.Object(base.properties, options) as TOmitOptional<T>
}
