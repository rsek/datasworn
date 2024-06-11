import Pattern from '../../pkg-core/IdElements/Pattern.js'

const typePattern = '[a-z][a-z_](?:.[a-z][a-z_]){0,2}+'
const dictKeyOrIndexPattern = `[\\/\\.][a-z_0-9]+`
const pathPattern = `${Pattern.RulesPackageElement.source}(?:${dictKeyOrIndexPattern})+?`

const idPattern = `(?<type>${typePattern}):(?<path>${pathPattern})`

const idPointerPattern = new RegExp(`^${idPattern}$`)

const linkSymbolPattern = new RegExp(
	[
		`(?<=\\[\\w.+?\\]\\()`, // lookbehind for markdown text in square brackets, plus left paren
		`(?<id>${idPattern})`,
		`(?=\\))` // lookafter for right paren
	].join('')
)

const macroSymbolPattern = new RegExp(
	[
		`(?<=\\{\\{)`, // lookbehind for left curly braces
		`(?<directive>[a-z][a-z_]+>)`,
		`(?<id>${idPattern})`,
		`(?=\\}\\})` // lookafter for right curly braces
	].join('')
)

export function validateText(
	data: unknown,
	key: string,
	idTracker: Set<string>
) {
	const errors: unknown[] = []

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
			} catch (e: any) {
				errors.push(e)
			}
			try {
				validateMacroIdPointers(v, idTracker)
			} catch (e: any) {
				errors.push(e)
			}
		}
	})

	if (errors.length > 0) throw new Error(errors.map(String).join('\n'))
}

export function validateMacroIdPointers(text: string, validIds: Set<string>) {
	const macros = text.matchAll(macroSymbolPattern)

	const errors = []
	for (const macro of macros) {
		if (macro.groups == null) continue
		const { directive, path } = macro.groups

		switch (directive) {
			case 'table':
			case 'text':
				return validateIdPointer(path, validIds)

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
	validIds: Set<string>
) {
	const links = text.matchAll(linkSymbolPattern)

	const errors = []

	for (const link of links) {
		if (link.groups == null) continue
		const { type, path } = link.groups

		// ids.push(path)

		switch (type) {
			case 'id':
				try {
					validateIdPointer(path, validIds)
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

export function validateIdPointer(
	dataswornId: string,
	idTracker: Set<string> | Map<string, unknown>
) {
	if (idTracker.has(dataswornId)) return true

	throw Error(`Bad Datasworn ID pointer: ${dataswornId}`)
}

/** Recursively iterates over JSON values, applying a function to every primitive boolean, number, string, and null value. */
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
			else if (Array.isArray(value))
				value.forEach((v, k) => {
					forEachValue(v, k, fn)
				})
			else for (const k in value) forEachValue(value[k], k, fn)
			break
		default:
			throw Error('Unrecognized type')
	}
}
