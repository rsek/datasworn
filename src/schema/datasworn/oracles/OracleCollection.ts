import {
	Type,
	type SchemaOptions,
	type Static,
	type TLiteral,
	type TRef
} from '@sinclair/typebox'
import { type SetRequired } from 'type-fest'
import * as Generic from '../Generic.js'
import * as Utils from '../Utils.js'
import { Id, Metadata } from '../common/index.js'
import { type TFuzzyObject } from '../utils/typebox.js'
import {
	OracleColumnDetails,
	OracleColumnSimple,
	OracleTableRollable
} from './OracleRollable.js'
import {
	ColumnLabels,
	type OracleTableRowDetails,
	type OracleTableRowSimple
} from './TableRow.js'

const OracleCollectionType = Utils.UnionEnumFromRecord(
	{
		tables: 'A grouping of separate tables.',
		table_shared_rolls:
			'A table with one roll column and multiple result columns.',
		table_shared_results:
			'A table with multiple roll columns and one result column.',
		table_shared_details:
			'A table with multiple roll columns, one result column, and one details column.'
	},
	{
		$id: 'OracleCollectionType'
	}
)
type OracleCollectionType = Static<typeof OracleCollectionType>

const CollectionMeta = Type.Object({
	images: Type.Optional(
		Type.Array(
			Type.Ref(Metadata.WebpImageUrl, {
				description: 'Extra images associated with this oracle.'
			})
		)
	),
	icon: Type.Optional(
		Type.Ref(Metadata.SvgImageUrl, {
			description: 'An icon that represents this oracle.'
		})
	),
	replaces: Type.Optional(
		Type.Ref(Id.OracleCollectionId, {
			description:
				'Indicates that this object replaces the identified OracleCollection. References to the replaced object can be considered equivalent to this object.'
		})
	)
})

function OracleCollectionBase<
	Props extends { oracle_type: TLiteral<string> },
	Rollable extends TRef<TFuzzyObject>
>(
	properties: Props,
	rollable: Rollable,
	recursive: false,
	options: SetRequired<SchemaOptions, '$id'>
): Generic.TCollection<Rollable, Props>
function OracleCollectionBase<
	T extends { oracle_type: TLiteral<string> },
	Rollable extends TRef<TFuzzyObject>
>(
	properties: T,
	rollable: Rollable,
	recursive: true,
	options: SetRequired<SchemaOptions, '$id'>
): Generic.TRecursiveCollection<Generic.TCollection<Rollable, T>>
function OracleCollectionBase<
	T extends { oracle_type: TLiteral<string> },
	Rollable extends TRef<TFuzzyObject>,
	Recursive extends boolean
>(
	properties: T,
	rollable: Rollable,
	recursive: Recursive,
	options: SetRequired<SchemaOptions, '$id'>
): Recursive extends true
	? Generic.TRecursiveCollection<Generic.TCollection<Rollable, T>>
	: Generic.TCollection<Rollable, T> {
	if (!recursive)
		return Generic.Collection(
			Type.Ref(Id.OracleCollectionId),
			rollable,
			properties,
			options
		) as any

	// recursive version can recurse to *any* OracleCollection
	const result = Generic.RecursiveCollection(
		Generic.Collection(Type.Ref(Id.OracleCollectionId), rollable, properties),
		options
	) as any

	result.properties.collections = Type.Optional(
		Generic.Dictionary(Type.Ref<TOracleCollection>('OracleCollection'))
	)

	return result
}

export const OracleTablesCollection = OracleCollectionBase(
	{
		oracle_type: Utils.ExtractLiteralFromEnum(OracleCollectionType, 'tables', {
			default: 'tables'
		})
	},
	Type.Ref(OracleTableRollable),
	true,
	{
		$id: 'OracleTablesCollection',
		description:
			'An OracleCollection that represents a category or grouping of tables, which may themselves be `OracleTablesCollection`s.'
	}
)

export type TOracleTablesCollection = typeof OracleTablesCollection
export type OracleTablesCollection = Static<TOracleTablesCollection>

export const OracleTableSharedRolls = OracleCollectionBase(
	{
		column_labels: ColumnLabels<typeof OracleColumnSimple>(
			{ roll: 'Roll' },
			{
				description:
					'Provides column labels for this table. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row). For all other column labels, see the `name` property of each child `OracleColumn`.'
			}
		),
		oracle_type: Utils.ExtractLiteralFromEnum(
			OracleCollectionType,
			'table_shared_rolls',
			{ default: 'table_shared_rolls' }
		)
	},
	Type.Ref(OracleColumnSimple),
	false,
	{
		$id: 'OracleTableSharedRoll',
		description:
			'An OracleCollection representing a single table with one roll column and multiple `result` columns.'
	}
)

export type TOracleTableSharedRolls = typeof OracleTableSharedRolls
export type OracleTableSharedRolls = Static<TOracleTableSharedRolls>

export const OracleTableSharedResults = OracleCollectionBase(
	{
		column_labels: ColumnLabels<typeof OracleTableRowSimple>({
			result: 'Result'
		}),
		oracle_type: Utils.ExtractLiteralFromEnum(
			OracleCollectionType,
			'table_shared_results'
		)
	},
	Type.Ref(OracleColumnSimple),
	false,
	{
		$id: 'OracleTableSharedResults',
		description:
			'An OracleCollection representing a single table with multiple roll columns and one `result` column.'
	}
)

export type TOracleTableSharedResults = typeof OracleTableSharedResults
export type OracleTableSharedResults = Static<TOracleTableSharedResults>

export const OracleTableSharedDetails = OracleCollectionBase(
	{
		column_labels: ColumnLabels<typeof OracleTableRowDetails>({
			result: 'Result',
			detail: 'Detail'
		}),
		oracle_type: Utils.ExtractLiteralFromEnum(
			OracleCollectionType,
			'table_shared_details'
		)
	},
	Type.Ref(OracleColumnDetails),
	false,
	{
		$id: 'OracleTableSharedDetails',
		description:
			'An OracleCollection representing a single table with multiple roll columns, one `result` column, and one `detail` column.'
	}
)

export type TOracleTableSharedDetails = typeof OracleTableSharedDetails
export type OracleTableSharedDetails = Static<TOracleTableSharedDetails>

export const OracleCollection = Utils.DiscriminatedUnion(
	[
		OracleTablesCollection,
		OracleTableSharedRolls,
		OracleTableSharedResults,
		OracleTableSharedDetails
	],
	'oracle_type',
	{ $id: 'OracleCollection' }
)

export type TOracleCollection = typeof OracleCollection
export type OracleCollection = Static<TOracleCollection>
