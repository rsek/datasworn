import type { Datasworn } from '../index.js'
import * as Collection from './Collection.js'
import * as OracleRollable from './OracleRollable.js'

export function validate<T extends Datasworn.OracleCollection>(collection: T) {
	const errors = []

	const { oracle_type } = collection

	switch (oracle_type) {
		case 'table_shared_rolls':
			try {
				oracleRowsEqualBy(rowHasSameRolls, collection.contents)
			} catch (e) {
				// console.table(renderMultiTable(collection.contents, ['roll']))
				throw new Error(
					`${oracle_type} child OracleRollables must have the same roll ranges in their rows, in the same order. The following rows array indices don't match:\n${String(e)}`
				)
			}
			break
		case 'table_shared_text':
		case 'table_shared_text2':
		case 'table_shared_text3':
			try {
				oracleRowsEqualBy(rowHasSameText, collection.contents)
			} catch (e) {
				// console.table(renderMultiTable(collection.contents, ['text']))
				throw new Error(
					`${oracle_type} child OracleRollables must have the same text content in their rows, in the same order. The following rows array indices don't match:\n${String(e)}`
				)
			}
			break
		case 'tables':
		default:
			break
	}

	return true
}

/**
 *
 * @param equalityFn The function used to test equality of two parallel rows with the same index.
 * @param oracleRollables The OracleRollables to be compared.
 * @return An array of row indices; the rows with index fail at least one equality test.
 */
function oracleRowsEqualBy(
	equalityFn: (
		a: Datasworn.OracleRollableRow,
		b: Datasworn.OracleRollableRow
	) => boolean,
	oracleRollables: Record<string, Datasworn.OracleRollable>
) {
	const [[primaryKey, primary], ...secondaries] =
		Object.entries(oracleRollables)
	const badRowMessages: Record<number, string[]> = {}

	for (let rowIndex = 0; rowIndex < primary.rows.length; rowIndex++) {
		const rowA = primary.rows[rowIndex]

		for (const [secondaryKey, secondary] of secondaries) {
			const rowB = secondary.rows[rowIndex]
			try {
				equalityFn(rowA, rowB)
			} catch (e) {
				badRowMessages[rowIndex] ||= []
				badRowMessages[rowIndex].push(`<${secondaryKey}> ${String(e)}`)
			}
		}
	}

	const entries = Object.entries(badRowMessages)

	if (entries.length)
		throw new Error(entries.map(([k, v]) => `${k}: ${String(v)}`).join('\n'))

	return true
}

function rowHasSameRolls(
	a: Datasworn.OracleRollableRow,
	b: Datasworn.OracleRollableRow
) {
	if (a.roll?.min === b.roll?.min && a.roll?.max === b.roll?.max) return true
	throw new Error(
		`Expected roll range of ${JSON.stringify(a.roll)} but got ${JSON.stringify(b.roll)}`
	)
}
const textProperties = [
	'text',
	'text2',
	'text3',
] as const satisfies (keyof Datasworn.OracleRollableRowText3)[]

function rowHasSameText(
	a: Datasworn.OracleRollableRow,
	b: Datasworn.OracleRollableRow
) {
	for (const k of textProperties) {
		// neither has key -- skip it
		if (!(k in a) && !(k in b)) continue

		if ((a as unknown as Record<string, unknown>)[k] !== (b as unknown as Record<string, unknown>)[k])
			throw new Error(
				`expected "${k}" to be ${JSON.stringify((a as unknown as Record<string, unknown>)[k])}, but got ${JSON.stringify((b as unknown as Record<string, unknown>)[k])}`
			)
	}

	return true
}

function renderMultiTable<
	T extends Record<string, Datasworn.OracleRollable>,
	K extends (keyof Datasworn.OracleRollableRowText3)[],
>(oracleRollables: T, showContent: K) {
	const tabularData: Record<keyof T, string>[] = []

	const rollableEntries = Object.entries(oracleRollables)
	const [[_, primary]] = rollableEntries

	for (let rowIndex = 0; rowIndex < primary.rows.length; rowIndex++) {
		const rowData = {} as Record<keyof T, string>
		for (const [dictKey, oracleRollable] of rollableEntries) {
			const row = oracleRollable.rows[rowIndex]
			let content = ''
			for (const contentKey of showContent) {
				const contentValue = (row as unknown as Record<string, unknown>)[contentKey]
				switch (typeof contentValue) {
					case 'object':
						if (contentValue === null) content += '(none): '
						else if ('max' in contentValue && 'min' in contentValue)
							content += `${contentValue.min}-${contentValue.max}: `
						break
					case 'string':
						content += contentValue.replaceAll(
							/\[([A-z -]+)\]\([a-z_]+:.+?\)/g,
							'[$1]'
						)
						break
					default:
						break
				}
			}

			rowData[dictKey as keyof T] = content
		}
		tabularData.push(rowData)
	}

	return tabularData
}
