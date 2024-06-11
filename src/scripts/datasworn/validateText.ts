import { forEach, mapValues } from 'lodash-es'
import type { Datasworn } from '../../pkg-core/index.js'
import Log from '../utils/Log.js'

// TODO: these should be interpolated from constants.ts
const linkSymbolPattern =
	/\[\w.*?\]\((?<type>[a-z_]+):(?<target>[a-z][a-z_]+(\/[a-z_0-9]+){2,}?)\)/g

const macroSymbolPattern =
	/\{\{(?<type>[a-z_]+):(?<target>[a-z][a-z_]+(\/[a-z_0-9]+){2,}?)\}\}/g

const idPointerPattern = /^[a-z][a-z_]+(\/[a-z_0-9]+){2,}$/

export function validateText(
	data: unknown,
	key: string,
	idTracker: Set<string>
) {
	forEachValue(data, key, (v, k) => {
		if (typeof v !== 'string') return
		// skip non-string values
		// skip underscore keys
		if (typeof k === 'string' && k.startsWith('_')) return

		if (idPointerPattern.test(v)) {
			validateIdPointer(v, idTracker)
			// if it's a standalone pointer, markdown checks can be skipped
		} else {
			try {
				validateMarkdownIdPointers(v, idTracker)
			} catch (e) {
				Log.error(e)
			}
			try {
				validateMacroIdPointers(v, idTracker)
			} catch (e) {
				Log.error(e)
			}
		}
	})
}

export const IdsToValidate = new Set<string>()

export function validateMacroIdPointers(text: string, validIds: Set<string>) {
	const macros = text.matchAll(macroSymbolPattern)

	const errors = []
	for (const macro of macros) {
		if (macro.groups == null) continue
		const { type, target } = macro.groups

		switch (type) {
			case 'table':
			case 'text':
				return validateIdPointer(target, validIds)

			default:
				errors.push(
					`Unknown Datasworn macro type "${String(type)}": ${macro[0]}`
				)
		}
	}

	if (errors.length > 0) throw new Error(errors.map(String).join('\n'))

	return true
}

export function validateMarkdownIdPointers(
	text: string,
	validIds: Set<string>
) {
	const links = text.matchAll(linkSymbolPattern)

	const errors = []

	// const ids = []

	for (const link of links) {
		if (link.groups == null) continue
		const { type, target } = link.groups

		// ids.push(target)

		switch (type) {
			case 'id':
				try {
					validateIdPointer(target, validIds)
				} catch (e) {
					errors.push(e)
				}
				break

			default:
				errors.push(`Unknown Datasworn link type: ${link[0]}`)
		}
	}

	if (errors.length > 0) throw new Error(errors.map(String).join('\n'))

	return true
}

export function validateIdPointer(dataswornId: string, idTracker: Set<string>) {
	if (idTracker.has(dataswornId)) return true

	throw Error(`Bad Datasworn ID pointer: ${dataswornId}`)
}

/** Recursively iterates over JSON values, applying a function to every boolean, number, string, and null value. */
export function forEachValue<T = unknown>(
	value: T,
	key: string | number,
	fn: (v: boolean | number | string | null, k: unknown) => void
): void {
	switch (typeof value) {
		case 'undefined':
			break
		case 'boolean':
		case 'number':
		case 'string':
			fn(value, key)
			break
		case 'object':
			if (value === null) fn(value, key)
			else
				forEach(value, (v, k) => {
					forEachValue(v, k, fn)
				})
			break
		default:
			throw Error('Unrecognized type')
	}
}
