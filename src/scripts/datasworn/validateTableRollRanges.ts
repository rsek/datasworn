import type { OracleRollable, OracleTableRow } from '../../types/Datasworn.js'

// TODO

type RollableRange = Pick<OracleTableRow, 'min' | 'max'>

function sortTableRow(a: RollableRange, b: RollableRange) {
	const aIsNullRow = a.min === null && a.max === null
	const bIsNullRow = b.min === null && b.max === null

	if (aIsNullRow && bIsNullRow) return 0

	if (aIsNullRow) return -1

	if (bIsNullRow) return 1

	// assert that they're numbers

	if (a.max < a.min) return 0
}

// assumes that rows are sorted sequentially
export function validateTableRollRanges(oracleRollable: OracleRollable) {
	const [numberOfDice, sides, modifier] = oracleRollable.dice
		.split(/d\+-/)
		.map(Number)

	const rollMin = numberOfDice + modifier
	const rollMax = numberOfDice * sides + modifier

	for (let i = 0; i < oracleRollable.rows.length; i++) {
		const row = oracleRollable.rows[i]

		// unrollable row for cosmetic purposes -- doesn't need validation
		if (row.min === null && row.max === null) continue

		// min and max must both be null or both be integers
		if (
			row.min === null ||
			row.max === null ||
			!(Number.isInteger(row.min) && Number.isInteger(row.max))
		)
			throw new Error('Row min and max must both be integers, or both be null')

		if (row.min < rollMin)
			throw new Error('Row min is less than the minimum possible roll.')
		if (row.max > rollMax)
			throw new Error('Row max is greater than the maximum possible roll.')

		// min must be less than or equal to max
		if (row.min > row.max) throw new Error('Row min is greater than row max')

		// what happens if there's blank rows intermixed, rather than a block at the start?
		// would this be easier if we compared the next row instead?
		// alternately, we could filter these ahead of time?
		// or set the last numbered row as a variable?

		const previousRow = oracleRollable.rows[i - 1] ?? null

		// if there's a previous row, its max must be 1 lower than this row's min
		if (previousRow !== null && previousRow.max !== row.min + 1)
			throw new Error('Row roll range is not sequential with previous row.')
	}

	return true
}
