import {
	Type,
	type ObjectOptions,
	type TObject,
	CloneType
} from '@sinclair/typebox'
import { isEqual } from 'lodash-es'
import type { UnionToIntersection } from 'type-fest'

export function FlatIntersect<T extends TObject[]>(
	schemas: [...T],
	options: ObjectOptions = {}
) {
	const mergedProps = {} as UnionToIntersection<T[number]['properties']>

	for (const schema of schemas) {
		// Object.assign(props, CloneType(schema).properties)
		const props = CloneType(schema).properties
		for (const k in props) {
			const oldProp = mergedProps[k]
			const newProp = props[k]

			// skip if it's the same thing
			if (isEqual(oldProp, newProp)) continue
			// skip if it's the optional version of the same schema
			if (isEqual(oldProp, Type.Optional(newProp))) continue

			// @ts-expect-error
			mergedProps[k] = newProp
		}
	}

	return Type.Object(mergedProps, options)
}
