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
	DetailsColumnLabels,
	OracleTableRow2TextCells,
	OracleTableRowBasic,
	SimpleColumnLabels,
	type ColumnLabels,
	OracleTableRow3TextCells,
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
		rows: Type.Array(row, {
			description:
				'An array of objects, each representing a single row of the table.'
		})
	})
}

function RollableTable<OracleRow extends TObject>(
	mappingKey: string,
	row: TRef<OracleRow>,
	column_labels: ReturnType<typeof ColumnLabels<OracleRow>>,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const base = Utils.Discriminable(
		Type.Object({
			...TableMixin<OracleRow>(column_labels).properties,
			...RollableMixin(row).properties
		}),
		'oracle_type',
		mappingKey
	)
	return Generic.RecursiveCollectable(
		Type.Ref(Id.OracleRollableId),
		base,
		options
	)
}

function RollableTableColumn<OracleRow extends TObject>(
	mappingKey: string,
	row: TRef<OracleRow>,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const base = Utils.Discriminable(
		Type.Object({
			...ColumnMixin.properties,
			...RollableMixin(row).properties
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
	return Generic.RecursiveCollectable(Type.Ref(Id.OracleRollableId), base)
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
		'source' // adequately provided by parent table
	] as (keyof Static<typeof base>)[]

	return Type.Omit(base, toOmit)
}

export const OracleTableSimple = RollableTable(
	'table_basic',
	Type.Ref(OracleTableRowBasic),
	SimpleColumnLabels,
	{
		$id: 'OracleTableSimple',
		description:
			'Represents a basic rollable oracle table with one roll column and one `result` column.'
	}
)
export type TOracleTableSimple = typeof OracleTableSimple
export type OracleTableSimple = Static<typeof OracleTableSimple>

export const OracleTable2TextColumns = RollableTable(
	'table_text2',
	Type.Ref(OracleTableRow2TextCells),
	DetailsColumnLabels,
	{
		$id: 'OracleTable2TextColumns',
		description:
			'A rollable oracle table with one roll column and two text columns.'
	}
)
export type TOracleTable2TextColumns = typeof OracleTable2TextColumns
export type OracleTable2TextColumns = Static<typeof OracleTable2TextColumns>

export const OracleTable3TextColumns = RollableTable(
	'table_3_text_columns',
	Type.Ref(OracleTableRow3TextCells),
	Text3ColumnLabels,
	{
		$id: 'OracleTable3TextColumns',
		description:
			'A rollable oracle table with one roll column and 3 text columns.'
	}
)
export type TOracleTable3TextColumns = typeof OracleTable3TextColumns
export type OracleTable3TextColumns = Static<typeof OracleTable2TextColumns>

export const OracleColumnSimple = RollableTableColumn(
	'column_basic',
	Type.Ref(OracleTableRowBasic),
	{
		$id: 'OracleColumnSimple',
		description: 'Represents a single column in an OracleCollection.'
	}
)
export type TOracleColumnSimple = typeof OracleColumnSimple
export type OracleColumnSimple = Static<typeof OracleColumnSimple>

export const OracleColumn2TextCells = RollableTableColumn(
	'column_text2',
	Type.Ref(OracleTableRow2TextCells),
	{
		$id: 'OracleColumn2TextCells'
	}
)

export type TOracleColumn2TextCells = typeof OracleColumn2TextCells
export type OracleColumn2TextCells = Static<typeof OracleColumn2TextCells>

export const OracleColumn3TextCells = RollableTableColumn(
	'column_3_text_cells',
	Type.Ref(OracleTableRow3TextCells),
	{
		$id: 'OracleColumn3TextCells'
	}
)

export type TOracleColumn3TextCells = typeof OracleColumn3TextCells
export type OracleColumn3TextCells = Static<typeof OracleColumn2TextCells>

export const OracleRollable = Utils.setDiscriminatorDefault(
	Utils.DiscriminatedUnion(
		[
			OracleTableSimple,
			OracleTable2TextColumns,
			OracleTable3TextColumns,
			OracleColumnSimple,
			OracleColumn2TextCells,
			OracleColumn3TextCells
		],
		'oracle_type',
		{
			$id: 'OracleRollable',
			description:
				'A collection of table rows from which random results may be rolled. This may represent a standalone table, or a column in a larger table.'
		}
	),
	'table_basic'
)

export type OracleRollable = Static<typeof OracleRollable>
export type TOracleRollable = typeof OracleRollable

export const OracleTableRollable = Utils.setDiscriminatorDefault(
	Utils.DiscriminatedUnion(
		[OracleTableSimple, OracleTable2TextColumns],
		'oracle_type',
		{
			$id: 'OracleTableRollable'
		}
	),
	'table_basic'
)

export type OracleTableRollable = Static<typeof OracleTableRollable>
export type TOracleTableRollable = typeof OracleTableRollable
