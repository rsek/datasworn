import type { Datasworn } from '../index.js'
import * as OracleTableRow from './OracleTableRow.js'

const diceExpressionPattern =
	/^(?<numberOfDice>[1-9][0-9]*)d(?<sides>[1-9][0-9]*)(?<modifier>[+-]([1-9][0-9]*))?$/

export function validate<T extends Datasworn.OracleRollable>(object: T) {
	if (!validateTableRollRanges(object)) throw new Error()

	return true
}

// assumes that rows are sorted sequentially

function validateTableRollRanges(
	oracleRollable: Datasworn.OracleRollable,
	noSort = false
) {
	const { min: rollMin, max: rollMax } = getDiceRange(oracleRollable.dice)

	const rows = noSort
		? oracleRollable.rows
		: oracleRollable.rows.sort(compareRanges)

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]

		// unrollable row for cosmetic purposes -- doesn't need validation
		if (row.roll == null) continue

		const { min, max } = row.roll

		// basic validation of a single row's contents
		OracleTableRow.validate(row)

		// min and max must both be null or both be integers

		if (min < rollMin)
			throw new Error(`Row (${i}) min is less than the minimum possible roll.`)
		if (max > rollMax)
			throw new Error(
				`Row (${i}) max is greater than the maximum possible roll.`
			)

		// min must be less than or equal to max
		if (min > max) throw new Error(`Row (${i}) min is greater than row max`)

		// what happens if there's blank rows intermixed, rather than a block at the start?
		// would this be easier if we compared the next row instead?
		// alternately, we could filter these ahead of time?
		// or set the last numbered row as a variable?
		const previousRow = rows[i - 1] ?? null

		if (previousRow?.roll == null) continue

		// if there's a previous row, its max must be 1 lower than this row's min
		if (previousRow.roll.max !== min + 1)
			throw new Error(
				`Row (${i}) roll range is not sequential with previous row.`
			)
	}

	return true
}


function getDiceRange(diceExpression: Datasworn.DiceExpression) {
	const parsed = diceExpressionPattern.exec(diceExpression)

	if (parsed == null)
		throw new Error(
			`Could not parse ${String(diceExpression)} as a dice expression.`
		)

	const [numberOfDice, sides, modifier] = parsed.map((numberString) => {
		const n = Number(numberString)
		if (Number.isNaN(n)) return 0
		if (!Number.isInteger(n))
			throw new Error(`Dice expression elements must be an integer value`)
		return n
	})

	const min = numberOfDice + modifier
	const max = numberOfDice * sides + modifier

	return { min, max }
}
type RowLike = { roll: { min: number; max: number } | null }
/**
 *
 * @param a The first row to compare.
 * @param b The second row to compare.
 * @returns `-1` if `a` comes before `b`, `1` if `b` comes before `a`, or `0` if the sort order is unchanged.
 */

export function compareRanges(a: RowLike, b: RowLike) {
	if (a.roll == null && b.roll == null) return 0

	if (a.roll == null && b.roll != null) return -1

	if (a.roll != null && b.roll == null) return 1

	return a.roll.min < b.roll.min ? -1 : b.roll.min > a.roll.min ? 1 : 0
}
