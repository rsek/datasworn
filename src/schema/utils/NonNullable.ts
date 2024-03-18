import { CloneType } from '@sinclair/typebox'
import { type TNullable } from './Nullable.js'

export function NonNullable<T extends TNullable>(base: T) {
	return CloneType(base.anyOf[0])
}
