import {
	Type,
	TypeClone,
	type ObjectOptions,
	type ObjectProperties,
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
	DetailsRowLabels,
	OracleTableRowDetails,
	OracleTableRowSimple,
	SimpleRowLabels,
	type ColumnLabels
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
		...TypeClone.Type(RollableMeta).properties,
		...Type.Pick(Generic.SourcedNodeBase, ['tags', 'suggestions']).properties,
		table: Type.Array(row, {
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
	column_labels: ReturnType<typeof ColumnLabels<OracleRow>>,
	options: SetRequired<ObjectOptions, '$id'>
) {
	const base = Utils.Discriminable(
		Type.Object({
			...ColumnMixin<OracleRow>(column_labels).properties,
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
		...TypeClone.Type(TableMeta).properties,
		...TypeClone.Type(Type.Object(properties)).properties,
		table: Type.Array(
			{
				...row
			},
			{
				description:
					'An array of objects, each representing a single row of the table.'
			}
		)
	}) as TObject<
		ObjectProperties<typeof TableMeta> & Props & { table: TArray<OracleRow> }
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
	'table_simple',
	Type.Ref(OracleTableRowSimple),
	SimpleRowLabels,
	{
		$id: 'OracleTableSimple',
		description:
			'Represents a basic rollable oracle table with one roll column and one `result` column.'
	}
)
export type TOracleTableSimple = typeof OracleTableSimple
export type OracleTableSimple = Static<typeof OracleTableSimple>

export const OracleTableDetails = RollableTable(
	'table_details',
	Type.Ref(OracleTableRowDetails),
	DetailsRowLabels,
	{
		$id: 'OracleTableDetails',
		description:
			'A rollable oracle table with one roll column, one `result` column, and one `detail` column.'
	}
)
export type TOracleTableDetails = typeof OracleTableDetails
export type OracleTableDetails = Static<typeof OracleTableDetails>

// Utils.Discriminable(
// 	OracleRollableBase(Type.Ref(OracleTableRowSimple), {
// 		column_labels: ColumnLabels({ roll: 'Roll', result: 'Result' })
// 	}),
// 	'oracle_type',
// 	'table_simple',
// 	{
// 		$id: 'OracleTableSimple',
// 		description:
// 			'Represents a basic oracle table with one roll column and one result column.'
// 	}
// )
export const OracleColumnSimple = RollableTableColumn(
	'column_simple',
	Type.Ref(OracleTableRowSimple),
	SimpleRowLabels,
	{
		$id: 'OracleColumnSimple',
		description: 'Represents a single column in an OracleCollection.'
	}
)
export type TOracleColumnSimple = typeof OracleColumnSimple
export type OracleColumnSimple = Static<typeof OracleColumnSimple>

// export const OracleTableDetails = Utils.Discriminable(
// 	OracleRollableBase(Type.Ref(OracleTableRowDetails), {
// 		column_labels: ColumnLabels({
// 			roll: 'Roll',
// 			result: 'Result',
// 			details: 'Detail'
// 		})
// 	}),
// 	'oracle_type',
// 	'details',
// 	{
// 		$id: 'OracleTableDetails',
// 		description:
// 			'An oracle table with one roll column, one `result` column, and one `detail` column.'
// 	}
// )

export const OracleColumnDetails = RollableTableColumn(
	'column_details',
	Type.Ref(OracleTableRowDetails),
	DetailsRowLabels,
	{
		$id: 'OracleColumnDetails'
	}
)

export type TOracleColumnDetails = typeof OracleColumnDetails
export type OracleColumnDetails = Static<typeof OracleColumnDetails>

export const OracleRollable = Utils.setDiscriminatorDefault(
	Utils.DiscriminatedUnion(
		[
			OracleTableSimple,
			OracleTableDetails,
			OracleColumnSimple,
			OracleColumnDetails
		],
		'oracle_type',
		{
			$id: 'OracleRollable',
			description:
				'A collection of table rows from which random results may be rolled. This may represent a standalone table, or a column in a larger table.'
		}
	),
	'table_simple'
)

export type OracleRollable = Static<typeof OracleRollable>
export type TOracleRollable = typeof OracleRollable

export const OracleTableRollable = Utils.setDiscriminatorDefault(
	Utils.DiscriminatedUnion(
		[OracleTableSimple, OracleTableDetails],
		'oracle_type',
		{
			$id: 'OracleTableRollable'
		}
	),
	'table_simple'
)

export type OracleTableRollable = Static<typeof OracleTableRollable>
export type TOracleTableRollable = typeof OracleTableRollable
