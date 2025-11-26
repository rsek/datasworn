/**
 * TODO: Complete i18n extraction implementation
 *
 * This module is a work-in-progress and requires:
 * 1. Updating to the new json-schema-library API (SchemaNode, compileSchema, toDataNodes)
 * 2. Implementing traversal logic to replace the deprecated `.each()` method
 */

import {
	type JsonSchema,
	type SchemaNode,
	Draft07
} from 'json-schema-library'

import type { Datasworn } from '../../pkg-core/index.js'

const sep = '/'

function getParentPointer(pointer: string) {
	const parts = pointer.split(sep)
	parts.pop()
	return parts.join(sep)
}

function getValueAtPointer(obj: unknown, pointer: string): unknown {
	if (!pointer || pointer === '/') return obj
	const parts = pointer.split('/').filter(Boolean)
	let current: unknown = obj
	for (const part of parts) {
		if (current == null || typeof current !== 'object') return undefined
		current = (current as Record<string, unknown>)[part]
	}
	return current
}

function synthesizeId(
	pointer: string,
	source: Datasworn.RulesPackage,
	parts: string[] = []
): string {
	const parentPointer = getParentPointer(pointer)
	const key = pointer.split(sep).pop()

	const parent = getValueAtPointer(source, parentPointer) as
		| { _id?: string }
		| undefined

	if (typeof parent === 'undefined')
		throw new Error(`Pointer ${parentPointer} doesn't exist`)

	parts.unshift(key as string)

	if (typeof parent._id === 'string') return [parent._id, ...parts].join('.')

	return synthesizeId(parentPointer, source, parts)
}

export function extractLocaleStrings(
	source: Datasworn.RulesPackage,
	schema: JsonSchema
) {
	const strings = new Map<string, string>()

	// TODO: The json-schema-library API has changed significantly in v10
	// Need to rewrite this using the new Draft07 class and SchemaNode traversal
	const _draft = new Draft07(schema) // eslint-disable-line @typescript-eslint/no-unused-vars

	// Placeholder: The old toDataNodes method no longer exists
	// This needs to be reimplemented with the new traversal API
	const dataNodes: Array<{ node: { schema: unknown }; value: unknown; pointer: string }> = []
	console.warn('extractLocaleStrings: Not implemented for json-schema-library v10')

	for (const { node: schemaNode, value: data, pointer } of dataNodes) {
		const schemaProps = schemaNode.schema as { i18n?: boolean }
		if (schemaProps.i18n === true && typeof data === 'string' && data.length) {
			const cleanPointer = pointer.replace('#', '')
			strings.set(synthesizeId(cleanPointer, source), data)
		}
	}

	// TODO: use tags to distinguish sense/part of speech

	const groupedStrings = new Map<string, string[]>()

	for (const [pointer, keyLocaleString] of strings) {
		if (groupedStrings.has(keyLocaleString))
			groupedStrings.set(keyLocaleString, [
				...(groupedStrings.get(keyLocaleString) as string[]),
				pointer,
			])
		else groupedStrings.set(keyLocaleString, [pointer])
	}

	return groupedStrings
}
