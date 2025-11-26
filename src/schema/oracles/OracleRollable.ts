import {
	Type,
	type ObjectOptions,
	type Static,
	type TObject,
	type TRefUnsafe,
	type TSchema
} from '@sinclair/typebox'
import type { SetRequired } from 'type-fest'
import { CollectableSubtypeNode } from '../generic/CollectableNode.js'
import * as Utils from '../Utils.js'
import * as Rolls from '../common/Rolls.js'
import { FlatIntersect } from '../utils/FlatIntersect.js'
import {
	OracleRollableRowText,
	OracleRollableRowText2,
	OracleRollableRowText3
} from './TableRow.js'
import {
	TextColumnLabels,
	Text2ColumnLabels,
	Text3ColumnLabels
} from './Table.js'

// metadata necessary to generate a roll result from an OracleRollable
const RollableMeta = Type.Object({
	recommended_rolls: Type.Optional(
		Type.Object({
			min: Type.Integer({ default: 1 }),
			max: Type.Integer({ default: 1 })
		})
	),
	dice: Type.Ref(Rolls.DiceExpression, {
		default: '1d100',
		description: 'The roll used to select a result on this oracle.'
	}),
	match: Type.Optional(
		Type.Ref(Rolls.OracleMatchBehavior, {
			description:
				'Most oracle tables are insensitive to matches, but a few define special match behavior.'
		})
	)
})

const subtypeKey = 'oracle_type' as const

function OracleRollableBase<TBase extends TObject, TSubtype extends string>(
	base: TBase,
	row: TRefUnsafe<TObject>,
	options: ObjectOptions = {}
) {
	const enhancedBase = FlatIntersect(
		[
			RollableMeta,
			Type.Object({
				rows: Type.Array(row, {
					description:
						'An array of objects, each representing a single row of the table.',
					rollable: true
				})
			}),
			base
		],
		options
	)

	return enhancedBase
}
function RollableTable<TRow extends TObject, TSubtype extends string>(
	subtype: TSubtype,
	row: TRefUnsafe<TRow>,
	column_labels: TSchema,
	options: SetRequired<ObjectOptions, '$id'>
) {
	return CollectableSubtypeNode(
		OracleRollableBase(
			Type.Object({ column_labels }),
			row
		),
		'oracle_rollable',
		subtypeKey,
		subtype,
		options
	)
}

function RollableColumn<TRow extends TObject, TSubtype extends string>(
	subtype: TSubtype,
	row: TRefUnsafe<TRow>,
	options: SetRequired<ObjectOptions, '$id'>
) {
	return Type.Omit(
		CollectableSubtypeNode(
			OracleRollableBase(Type.Object({}), row),
			'oracle_rollable',
			subtypeKey,
			subtype,
			options
		),
		['_source'],
		options
	)
}

export const OracleTableText = RollableTable(
	'table_text',
	Type.Ref(OracleRollableRowText),
	TextColumnLabels,
	{
		$id: 'OracleTableText',
		description:
			'Represents a basic rollable oracle table with one roll column and one text result column.'
	}
)
export type TOracleTableText = typeof OracleTableText
export type OracleTableText = Static<typeof OracleTableText>

export const OracleTableText2 = RollableTable(
	'table_text2',
	Type.Ref(OracleRollableRowText2),
	Text2ColumnLabels,
	{
		$id: 'OracleTableText2',
		description:
			'A rollable oracle table with one roll column and two text columns.'
	}
)
export type TOracleTableText2 = typeof OracleTableText2
export type OracleTableText2 = Static<typeof OracleTableText2>

export const OracleTableText3 = RollableTable(
	'table_text3',
	Type.Ref(OracleRollableRowText3),
	Text3ColumnLabels,
	{
		$id: 'OracleTableText3',
		description:
			'A rollable oracle table with one roll column and 3 text columns.'
	}
)
export type TOracleTableText3 = typeof OracleTableText3
export type OracleTableText3 = Static<typeof OracleTableText2>

export const OracleColumnText = RollableColumn(
	'column_text',
	Type.Ref(OracleRollableRowText),
	{
		$id: 'OracleColumnText',
		description: 'Represents a single column in an OracleCollection.'
	}
)
export type TOracleColumnText = typeof OracleColumnText
export type OracleColumnText = Static<typeof OracleColumnText>

export const OracleColumnText2 = RollableColumn(
	'column_text2',
	Type.Ref(OracleRollableRowText2),
	{
		$id: 'OracleColumnText2'
	}
)

export type TOracleColumnText2 = typeof OracleColumnText2
export type OracleColumnText2 = Static<typeof OracleColumnText2>

export const OracleColumnText3 = RollableColumn(
	'column_text3',
	Type.Ref(OracleRollableRowText3),
	{
		$id: 'OracleColumnText3'
	}
)

export type TOracleColumnText3 = typeof OracleColumnText3
export type OracleColumnText3 = Static<typeof OracleColumnText2>

export const OracleRollable = Utils.DiscriminatedUnion(
	{
		table_text: OracleTableText,
		table_text2: OracleTableText2,
		table_text3: OracleTableText3,
		column_text: OracleColumnText,
		column_text2: OracleColumnText2,
		column_text3: OracleColumnText3
	},
	'oracle_type',
	{
		$id: 'OracleRollable',
		description:
			'A collection of table rows from which random results may be rolled. This may represent a standalone table, or a column in a larger table.'
	}
)

export type OracleRollable = Static<typeof OracleRollable>
export type TOracleRollable = typeof OracleRollable

export const OracleRollableTable = Utils.DiscriminatedUnion(
	{
		table_text: OracleTableText,
		table_text2: OracleTableText2,
		table_text3: OracleTableText3
	},
	'oracle_type',
	{
		$id: 'OracleRollableTable'
	}
)

export type OracleRollableTable = Static<typeof OracleRollableTable>
export type TOracleRollableTable = typeof OracleRollableTable
