import type { Datasworn } from '../index.js'
import * as OracleRollableRow from './OracleRollableRow.js'

const diceExpressionPattern =
	/^(?<numberOfDice>[1-9][0-9]*)d(?<sides>[1-9][0-9]*)(?<modifier>[+-]([1-9][0-9]*))?$/

export function validate<T extends Datasworn.OracleRollable>(object: T) {
	validateTableRollRanges(object, false)

	return true
}

// assumes that rows are sorted sequentially

function validateTableRollRanges(
	oracleRollable: Datasworn.OracleRollable,
	sort = false
) {
	const { min: rollMin, max: rollMax } = getDiceRange(oracleRollable.dice)

	const rows = sort
		? oracleRollable.rows.sort(compareRanges)
		: oracleRollable.rows

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]

		// unrollable row for cosmetic purposes -- doesn't need validation
		if (row.roll == null) continue

		const { min, max } = row.roll

		// basic validation of a single row's contents
		try {
			OracleRollableRow.validate(row)
		} catch (e) {
			throw new Error(`@ index ${i}: ${String(e)}`)
		}

		// min and max must both be null or both be integers

		if (min < rollMin)
			throw new Error(
				`@ index ${i}: roll.min (${min}) is less than the minimum possible roll of ${oracleRollable.dice} (${rollMin})`
			)
		if (max > rollMax)
			throw new Error(
				`@ index ${i}: roll.max (${max}) is greater than the maximum possible roll of ${oracleRollable.dice} (${rollMax})`
			)

		// what happens if there's blank rows intermixed, rather than a block at the start?
		// would this be easier if we compared the next row instead?
		// alternately, we could filter these ahead of time?
		// or set the last numbered row as a variable?
		const previousRow = rows[i - 1] ?? null

		if (previousRow?.roll == null) continue

		if (min !== previousRow.roll.max + 1)
			throw new Error(
				`@ index ${i}: Roll range (${min}-${max}) is not sequential with previous row (${previousRow.roll.min}-${previousRow.roll.max}).`
			)
	}

	return true
}

function getDiceRange(diceExpression: Datasworn.DiceExpression) {
	const parsed = diceExpressionPattern.exec(diceExpression)?.groups

	if (parsed == null)
		throw new Error(
			`Could not parse ${String(diceExpression)} as a dice expression.`
		)

	const [numberOfDice, sides, modifier] = Object.values(parsed).map(
		(numberString, i) => {
			const n = Number(numberString)
			if (Number.isNaN(n)) return 0
			if (!Number.isInteger(n))
				throw new Error(`Dice expression elements must be an integer value`)
			return n
		}
	)

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

	return a.roll!.min < b.roll!.min ? -1 : b.roll!.min > a.roll!.min ? 1 : 0
}
