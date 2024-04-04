import {
	Type,
	CloneType,
	type ObjectOptions,
	type Static,
	type TArray,
	type TObject,
	type TProperties,
	type TRef
} from '@sinclair/typebox'
import { type SetRequired } from 'type-fest'
import * as Generic from '../Generic.js'
import * as Utils from '../Utils.js'
import { Id, Rolls } from '../common/index.js'
import { ColumnMixin } from './Column.js'
import { TableMeta, TableMixin } from './Table.js'
import {
	Text2ColumnLabels,
	OracleTableRowText2,
	OracleTableRowText,
	TextColumnLabels,
	type ColumnLabels,
	OracleTableRowText3,
	Text3ColumnLabels
} from './TableRow.js'

// metadata necessary to generate a roll result from an OracleRollable
const RollableMeta = Type.Object({
	replaces: Type.Optional(
		Type.Ref(Id.OracleRollableId, {
			description:
				'Indicates that this object replaces the identified OracleRollable. References to the replaced object can be considered equivalent to this object.'
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

function RollableMixin<OracleRow extends TObject>(row: TRef<OracleRow>) {
	return Type.Object({
		...CloneType(RollableMeta).properties,
		...Type.Pick(Generic.SourcedNodeBase, ['tags', 'suggestions']).properties,
		type: Type.Literal('oracle_rollable'),
		rows: Type.Array(row, {
			description:
				'An array of objects, each representing a single row of the table.'
		})
	})
}

function RollableTable<OracleRow extends TObject, MappingKey extends string>(
	mappingKey: MappingKey,
	row: TRef<OracleRow>,
	column_labels: ReturnType<typeof ColumnLabels<OracleRow>>,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const base = Type.Object({
		oracle_type: Type.Literal(mappingKey),
		...TableMixin<OracleRow>(column_labels).properties,
		...RollableMixin(row).properties
	})
	return Generic.RecursiveCollectable(
		Type.Ref(Id.OracleRollableId),
		'oracle_rollable',
		base,
		options
	)
}

function RollableTableColumn<
	OracleRow extends TObject,
	MappingKey extends string
>(
	mappingKey: MappingKey,
	row: TRef<OracleRow>,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const base = Utils.Discriminable(
		Type.Object({
			...ColumnMixin.properties,
			...RollableMixin(row).properties,
			type: Type.Literal('oracle_rollable')
		}),
		'oracle_type',
		mappingKey
	)
	return Generic.IdentifiedNode(Type.Ref(Id.OracleRollableId), base, options)
}

function OracleRollableBase<
	Props extends TProperties,
	OracleRow extends TRef<TObject>
>(row: OracleRow, properties: Props) {
	const base = Type.Object({
		...CloneType(TableMeta).properties,
		...CloneType(Type.Object(properties)).properties,
		rows: Type.Array(
			{
				...row
			},
			{
				description:
					'An array of objects, each representing a single row of the table.'
			}
		)
	}) as TObject<
		(typeof TableMeta)['properties'] & Props & { rows: TArray<OracleRow> }
	>
	return Generic.RecursiveCollectable(
		Type.Ref(Id.OracleRollableId),
		'oracle_rollable',
		base
	)
}

function OracleColumnBase<
	Props extends TProperties,
	OracleRow extends TRef<TObject>
>(row: OracleRow, properties: Props) {
	const base = OracleRollableBase(row, properties)
	const toOmit = [
		'replaces',
		'images',
		'description', // too long
		'canonical_name', // no reason for `name` to be anything other than the column label
		'_source' // adequately provided by parent table
	] as (keyof Static<typeof base>)[]

	return Type.Omit(base, toOmit)
}

export const OracleTableText = RollableTable(
	'table_text',
	Type.Ref(OracleTableRowText),
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
	Type.Ref(OracleTableRowText2),
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
	Type.Ref(OracleTableRowText3),
	Text3ColumnLabels,
	{
		$id: 'OracleTableText3',
		description:
			'A rollable oracle table with one roll column and 3 text columns.'
	}
)
export type TOracleTableText3 = typeof OracleTableText3
export type OracleTableText3 = Static<typeof OracleTableText2>

export const OracleColumnText = RollableTableColumn(
	'column_text',
	Type.Ref(OracleTableRowText),
	{
		$id: 'OracleColumnText',
		description: 'Represents a single column in an OracleCollection.'
	}
)
export type TOracleColumnText = typeof OracleColumnText
export type OracleColumnText = Static<typeof OracleColumnText>

export const OracleColumnText2 = RollableTableColumn(
	'column_text2',
	Type.Ref(OracleTableRowText2),
	{
		$id: 'OracleColumnText2'
	}
)

export type TOracleColumnText2 = typeof OracleColumnText2
export type OracleColumnText2 = Static<typeof OracleColumnText2>

export const OracleColumnText3 = RollableTableColumn(
	'column_text3',
	Type.Ref(OracleTableRowText3),
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

export const OracleTableRollable = Utils.DiscriminatedUnion(
	{
		table_text: OracleTableText,
		table_text2: OracleTableText2,
		table_text3: OracleTableText3
	},
	'oracle_type',
	{
		$id: 'OracleTableRollable'
	}
)

export type OracleTableRollable = Static<typeof OracleTableRollable>
export type TOracleTableRollable = typeof OracleTableRollable
