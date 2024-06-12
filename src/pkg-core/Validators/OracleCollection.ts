import type { Datasworn } from '../index.js'
import * as Collection from './Collection.js'
import * as OracleRollable from './OracleRollable.js'

export function validate<T extends Datasworn.OracleCollection>(object: T) {
	const badIndices: number[] = []

	switch (object.oracle_type) {
		case 'table_shared_rolls':
			badIndices.push(
				...oracleRowsEqualBy(rowHasSameRolls, ...Object.values(object.contents))
			)
			if (badIndices.length)
				throw new Error(
					`${this.oracle_type} child OracleRollables must have the same roll ranges in their rows, in the same order. The following array indices don't match: ${badIndices.join(', ')}`
				)
			break
		case 'table_shared_text':
		case 'table_shared_text2':
		case 'table_shared_text3':
			badIndices.push(
				...oracleRowsEqualBy(rowHasSameText, ...Object.values(object.contents))
			)
			if (badIndices.length)
				throw new Error(
					`${this.oracle_type} child OracleRollables must have the same text content in their rows, in the same order. The following array indices don't match: ${badIndices.join(', ')}`
				)
			break
		case 'tables':
		default:
			break
	}

	return Collection.validate(object, validate, OracleRollable.validate)
}

/**
 *
 * @param equalityFn The function used to test equality of two parallel rows with the same index.
 * @param oracleRollables The OracleRollables to be compared.
 * @return An array of row indices; the rows with index fail at least one equality test.
 */
function oracleRowsEqualBy<T extends Datasworn.OracleRollable>(
	equalityFn: (
		a: Datasworn.OracleTableRow,
		b: Datasworn.OracleTableRow
	) => boolean,
	...oracleRollables: T[]
) {
	const [primary, ...secondaries] = oracleRollables
	const badRowIndices = new Set<number>()

	for (let i = 0; i < primary.rows.length; i++) {
		const primaryRow = primary.rows[i]

		for (const secondary of secondaries) {
			const secondaryRow = secondary.rows[i]
			if (!equalityFn(primaryRow, secondaryRow)) badRowIndices.add(i)
		}
	}

	return Array.from(badRowIndices)
}

function rowHasSameRolls(
	a: Datasworn.OracleTableRow,
	b: Datasworn.OracleTableRow
) {
	return a.roll.max === b.roll.max && a.roll.min === a.roll.max
}
const textProperties = [
	'text',
	'text2',
	'text3'
] as const satisfies (keyof Datasworn.OracleTableRowText3)[]

function rowHasSameText(
	a: Datasworn.OracleTableRow,
	b: Datasworn.OracleTableRow
) {
	for (const k of textProperties) {
		if (a[k] !== b[k]) return false
	}

	return true
}
