import JsonPointer from 'json-pointer'
import type * as Datasworn from '../../types/Datasworn.js'
import {
	isSortableObjectSchema,
	sortDataswornKeys,
	unsortableKeys
} from './sort.js'
import { sortTopLevelCollection } from './sortCollection.js'
import { type Draft07 } from 'json-schema-library'
import { Type } from '@sinclair/typebox'
import Assert from './validators.js'

/** Top-level properties to omit from key sorting. */
const topLevelKeysBlackList = [
	'rules'
] as const satisfies (keyof Datasworn.RulesPackage)[]
/** Separator character used for JSON pointers. */
const pointerSep = '/'
/** Hash character that prepends generated JSON pointers. */
const hashChar = '#'

export function cleanRulesPackage(
	datasworn: Datasworn.RulesPackage,
	jsl: Draft07
) {
	const sortedPointers: Record<string, unknown> = {}

	// sort non-dictionary objects
	jsl.each(datasworn, (schema, value: any, hashPointer) => {
		const nicePointer = hashPointer.startsWith(hashChar)
			? hashPointer.replace(hashChar, pointerSep)
			: hashPointer

		const key = nicePointer.split(pointerSep).pop() as string

		if (nicePointer === pointerSep) return

		// if (value?._id) console.log(value._id, '=>', nicePointer)

		if (
			value != null &&
			!unsortableKeys.includes(key as any) &&
			isSortableObjectSchema(schema)
		)
			sortedPointers[nicePointer] = sortDataswornKeys(value)
	})

	// sort collections
	for (const k in datasworn) {
		if (topLevelKeysBlackList.includes(k as any)) continue
		const v = datasworn[k as keyof Datasworn.RulesPackage]
		if (!Assert.SourcedNodeDictionary.Check(v)) continue

		const result = sortTopLevelCollection(v)

		// @ts-expect-error
		datasworn[k] = result
	}

	const jsonOut = JSON.parse(JSON.stringify(datasworn, replacer))

	// for (const pointer of pointersToDelete)
	// 	if (JsonPointer.has(jsonOut, pointer)) JsonPointer.remove(jsonOut, pointer)
	for (const pointer in sortedPointers)
		if (JsonPointer.has(jsonOut, pointer))
			JsonPointer.set(jsonOut, pointer, sortedPointers[pointer])

	return jsonOut as Datasworn.RulesPackage
}

function replacer(key: string, value: unknown) {
	// if (key.startsWith('_')) return undefined
	if (['number', 'boolean', 'string', 'undefined'].includes(typeof value))
		return value
	if (Array.isArray(value)) return value
	return value
}
