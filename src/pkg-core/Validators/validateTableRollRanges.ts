import type {
	DiceExpression,
	OracleRollable,
	OracleTableRow,
	OracleTableRowText3
} from '../Datasworn.js'

// TODO

type RowLike = { roll: { min: number; max: number } | null }

/**
 *
 * @param a The first row to compare.
 * @param b The second row to compare.
 * @returns `-1` if `a` comes before `b`, `1` if `b` comes before `a`, or `0` if the sort order is unchanged.
 */
function compareRowRanges(a: RowLike, b: RowLike) {
	if (a.roll == null && b.roll == null) return 0

	if (a.roll == null && b.roll != null) return -1

	if (a.roll != null && b.roll == null) return 1

	return a.roll.min < b.roll.min ? -1 : b.roll.min > a.roll.min ? 1 : 0
}

const rowTextKeys = [
	'text',
	'text2',
	'text3'
] as const satisfies (keyof OracleTableRowText3)[]

/**
 *
 * @param a The first row to compare.
 * @param b The second row to compare.
 * @returns `true` if the rows have the same text content.
 * @throws if the rows don't have the same text content.
 */
function rowsHaveSameText(a: OracleTableRow, b: OracleTableRow) {
	for (const key of rowTextKeys) {
		const k = key as keyof typeof a & keyof typeof b
		if (a[k] !== b[k])
			throw new Error(
				`Expected string "${String(a[k])}" but got "${String(b[k])}"`
			)
	}

	return true
}

const diceExpressionPattern =
	/^(?<numberOfDice>[1-9][0-9]*)d(?<sides>[1-9][0-9]*)(?<modifier>[+-]([1-9][0-9]*))?$/

function getDiceRange(diceExpression: DiceExpression) {
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

// assumes that rows are sorted sequentially
export function validateTableRollRanges(
	oracleRollable: OracleRollable,
	noSort = false
) {
	const { min: rollMin, max: rollMax } = getDiceRange(oracleRollable.dice)

	const rows = noSort
		? oracleRollable.rows
		: oracleRollable.rows.sort(compareRowRanges)

	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]

		// unrollable row for cosmetic purposes -- doesn't need validation
		if (row.roll == null) continue

		const { min, max } = row.roll

		// min and max must both be null or both be integers
		if (
			min === null ||
			max === null ||
			!(Number.isInteger(min) && Number.isInteger(max))
		)
			throw new Error(
				`Row (${i}) min and max must both be integers, or both be null`
			)

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

// TODO
// export function validateSharedRollColumn(oracle: OracleTableSharedRolls) {
// 	const columns =
// 		oracle.contents instanceof Map
// 			? oracle.contents
// 			: new Map(Object.entries(oracle.contents as Record<string, TextColumn>))

//   const firstColumn =
// }

// export function validateSharedResultColumn(
// 	oracle:
// 		| OracleTableSharedText
// 		| OracleTableSharedText2
// 		| OracleTableSharedText3
// ) {}

// contents
// collections
// tags

// const dictHavers: Record<ObjectType, string[]> = {
// 	oracle_rollable: ['tags'],
// 	move: ['tags'],
// 	asset: ['tags', 'options', 'controls', 'abilities.*.moves'],
// 	// asset ability moves
// 	// asset condition meter controls
// 	// asset enhancement controls
// 	// select field choices
// 	atlas_entry: ['tags'],
// 	npc: ['tags'],
// 	delve_site: ['tags'],
// 	delve_site_theme: ['tags'],
// 	delve_site_domain: ['tags'],
// 	truth: ['tags'],
// 	rarity: ['tags'],

// 	oracle_collection: ['contents', 'collections', 'tags'],
// 	move_category: ['contents', 'collections', 'tags'],
// 	asset_collection: ['contents', 'collections', 'tags'],
// 	atlas_collection: ['contents', 'collections', 'tags'],
// 	npc_collection: ['contents', 'collections', 'tags']
// }

// also: Dates!
