import {
	Type,
	CloneType,
	TypeGuard,
	type ObjectOptions,
	type Static,
	type TObject,
	type TOmit,
	type TPartial,
	type TPick
} from '@sinclair/typebox'
import { omit } from 'lodash-es'
import type * as TypeFest from 'type-fest'
import type { TAssign } from './FlatIntersect.js'

export type SetOptional<
	BaseType,
	Keys extends keyof BaseType
> = TypeFest.SetOptional<BaseType, Keys>

export type TSetOptional<
	T extends TObject,
	K extends (keyof Static<T>)[]
> = TAssign<TObject, TObject> // Simplified due to TComputed type issues
/** Make the provided keys optional */
export function SetOptional<
	T extends TObject,
	K extends Array<keyof Static<T>>
>(schema: T, optionalKeys: [...K], options: ObjectOptions = {}) {
	const base = omit(CloneType(schema), ['$id']) as T

	const toRemove: string[] = []

	for (const k of optionalKeys as string[]) {
		// skip if no such prop exists
		if (base.properties[k] == null) continue
		// skip if it's already optional
		if (TypeGuard.IsOptional(base.properties[k])) continue
		base.properties[k] = Type.Optional(base.properties[k])
		// flag key for removal from "required" array
		toRemove.push(k)
	}

	if (Array.isArray(base.required))
		base.required = base.required.filter((k) => toRemove.includes(k))

	return Type.Object(base.properties, {
		...omit(base, ['properties', 'required']),
		...options
	})
}
