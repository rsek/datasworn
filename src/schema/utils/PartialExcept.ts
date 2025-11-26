import {
	type TObject,
	type Static,
	type TPick,
	type TPartial,
	type TOmit,
	type SchemaOptions,
	Type
} from '@sinclair/typebox'
import { Assign, type TAssign } from './FlatIntersect.js'

export type PartialExcept<T, K extends keyof T> = Pick<T, K> &
	Partial<Omit<T, K>>

export type TPartialExcept<
	T extends TObject,
	K extends (keyof Static<T>)[]
> = TAssign<TObject, TObject> // Simplified due to TComputed type issues
/** Make everything optional except for the provided keys  */
export function PartialExcept<
	T extends TObject,
	K extends Array<keyof Static<T>>
>(schema: T, requiredKeys: [...K], options: SchemaOptions = {}) {
	return Assign(
		Type.Pick(schema, requiredKeys) as TObject,
		Type.Partial(Type.Omit(schema, requiredKeys)) as TObject,
		options
	)
}
