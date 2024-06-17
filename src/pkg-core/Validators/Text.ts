import Pattern from '../IdElements/Pattern.js'

const typeIdPattern = '[a-z][a-z_](?:.[a-z][a-z_]){0,2}'
const dictKeyOrIndexPattern = `[\\/\\.][a-z_0-9]+`
const pathPattern = `${Pattern.RulesPackageElement.source}(?:${dictKeyOrIndexPattern})+?`

const idPattern = `(?<typeId>${typeIdPattern}):(?<path>${pathPattern})`

const idPointerPattern = new RegExp(`^${idPattern}$`)

const linkSymbolPattern = new RegExp(
	[
		`(?<=\\[\\w.+?\\]\\()`, // lookbehind for markdown text in square brackets, plus left paren
		`(?<id>${idPattern})`,
		`(?=\\))` // lookahead for right paren
	].join(''),
	'g'
)

const macroSymbolPattern = new RegExp(
	[
		`(?<=\\{\\{)`, // lookbehind for left curly braces
		`(?<directive>[a-z][a-z_]+>)`,
		`(?<id>${idPattern})`,
		`(?=\\}\\})` // lookahead for right curly braces
	].join(''),
	'g'
)

export function validateIdsInStrings(
	data: unknown,
	validIds: Map<string, unknown> | Set<string>,
	validatedPointers?: Set<string>
) {
	const errors: unknown[] = []

	forEachPrimitiveValue(data, undefined, (v, k) => {
		// skip non-string values
		if (typeof v !== 'string') return
		// skip underscore keys
		if (typeof k === 'string' && k.startsWith('_')) return

		if (idPointerPattern.test(v)) {
			validateIdPointer(v, validIds, validatedPointers)
			// if it's a standalone pointer, markdown checks can be skipped
		} else {
			try {
				validateMarkdownIdPointers(v, validIds, validatedPointers)
			} catch (e: any) {
				errors.push(e)
			}
			try {
				validateMacroIdPointers(v, validIds, validatedPointers)
			} catch (e: any) {
				errors.push(e)
			}
		}
	})

	if (errors.length > 0) throw new Error(errors.map(String).join('\n'))

	return true
}

export function validateMacroIdPointers(
	text: string,
	validIds: Map<string, unknown> | Set<string>,
	validatedPointers?: Set<string>
) {
	const macros = text.matchAll(macroSymbolPattern)

	const errors = []
	for (const macro of macros) {
		if (macro.groups == null) continue
		const { directive, path } = macro.groups

		switch (directive) {
			case 'table':
			case 'text':
				return validateIdPointer(path, validIds, validatedPointers)

			default:
				errors.push(
					`Unknown Datasworn macro directive "${String(directive)}": ${macro[0]}`
				)
		}
	}

	if (errors.length > 0) throw new Error(errors.map(String).join('\n'))

	return true
}

export function validateMarkdownIdPointers(
	text: string,
	validIds: Map<string, unknown> | Set<string>,
	validatedPointers?: Set<string>
) {
	const links = text.matchAll(linkSymbolPattern)

	const errors = []

	for (const link of links) {
		if (link.groups == null) continue
		const { id } = link.groups

		try {
			validateIdPointer(id, validIds, validatedPointers)
		} catch (e) {
			errors.push(e)
		}
	}

	if (errors.length > 0) throw new Error(errors.map(String).join('\n'))

	return true
}

export function validateIdPointer(
	dataswornId: string,
	idTracker: Set<string> | Map<string, unknown>,
	validatedPointers?: Set<string>
) {
	if (!idTracker.has(dataswornId))
		throw Error(`Bad Datasworn ID pointer: ${dataswornId}`)

	if (validatedPointers instanceof Set) validatedPointers.add(dataswornId)

	return true
}

/** Recursively iterates over JSON values, applying a function to every primitive boolean, number, string, and null value. */
export function forEachPrimitiveValue<T = unknown>(
	value: T,
	key: string | number | undefined,
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
			if (value === null) fn(value as null, key)
			else if (Array.isArray(value))
				value.forEach((v, k) => {
					forEachPrimitiveValue(v, k, fn)
				})
			else for (const k in value) forEachPrimitiveValue(value[k], k, fn)
			break
		default:
			throw Error('Unrecognized type')
	}
}
