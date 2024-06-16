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
	OracleColumnText2,
	OracleColumnText,
	OracleRollableTable,
	OracleColumnText3,
	OracleTableText,
	OracleTableText3,
	OracleTableText2
} from './OracleRollable.js'
import {
	ColumnLabels,
	OracleRollableRowText,
	OracleRollableRowText2,
	OracleRollableRowText3
} from './TableRow.js'

// TODO: color property should get its own description: "An optional thematic color for this column. For an example, see \"Basic Creature Form\" (Starforged p. 337)"

const OracleCollectionType = Utils.UnionEnumFromRecord(
	{
		tables: 'A grouping of separate tables.',
		table_shared_rolls:
			'A table with one shared roll column, and multiple unique text columns.',
		table_shared_text:
			'A table with multiple unique roll columns, and one shared text column.',
		table_shared_text2:
			'A table with multiple unique roll columns, and 2 shared text columns.',
		table_shared_text3:
			'A table with multiple unique roll columns, and 3 shared text columns.'
	},
	{
		$id: 'OracleCollectionType'
	}
)
type OracleCollectionType = Static<typeof OracleCollectionType>

const subtypeKey = 'oracle_type' as const

export const OracleTablesCollection = Generic.CollectionSubtypeNode(
	Type.Object({}),
	'oracle_collection',
	subtypeKey,
	'tables' satisfies OracleCollectionType,
	Generic.Dictionary(Type.Ref('OracleRollableTable')),
	Generic.Dictionary(Type.Ref('OracleCollection')),
	{
		$id: 'OracleTablesCollection',
		description:
			'An OracleCollection that represents a category or grouping of tables, which may themselves be `OracleTablesCollection`s.'
	}
)

export type TOracleTablesCollection = typeof OracleTablesCollection
export type OracleTablesCollection = Static<TOracleTablesCollection>

export const OracleTableSharedRolls = Generic.CollectionSubtypeNode(
	Type.Object({
		column_labels: ColumnLabels<typeof OracleRollableRowText>(
			{ roll: 'Roll' },
			{
				description:
					'Provides column labels for this table. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row). For all other column labels, see the `name` property of each child `OracleColumn`.'
			}
		)
	}),
	'oracle_collection',
	subtypeKey,
	'table_shared_rolls' satisfies OracleCollectionType,
	Generic.Dictionary(Type.Ref(OracleColumnText)),
	undefined,
	{
		$id: 'OracleTableSharedRolls',
		description:
			'An OracleCollection representing a single table with one roll column and multiple text columns.'
	}
)

export type TOracleTableSharedRolls = typeof OracleTableSharedRolls
export type OracleTableSharedRolls = Static<TOracleTableSharedRolls>

export const OracleTableSharedText = Generic.CollectionSubtypeNode(
	Type.Object({
		column_labels: ColumnLabels<typeof OracleRollableRowText>({
			text: 'Result'
		})
	}),
	'oracle_collection',
	subtypeKey,
	'table_shared_text' satisfies OracleCollectionType,
	Generic.Dictionary(Type.Ref(OracleColumnText)),
	undefined,
	{
		$id: 'OracleTableSharedText',
		description:
			'An OracleCollection representing a single table with multiple roll columns and one text column.'
	}
)

export type TOracleTableSharedText = typeof OracleTableSharedText
export type OracleTableSharedText = Static<TOracleTableSharedText>

export const OracleTableSharedText2 = Generic.CollectionSubtypeNode(
	Type.Object({
		column_labels: ColumnLabels<typeof OracleRollableRowText2>({
			text: 'Result',
			text2: 'Details'
		})
	}),
	'oracle_collection',
	subtypeKey,
	'table_shared_text2' satisfies OracleCollectionType,
	Generic.Dictionary(Type.Ref(OracleColumnText2)),
	undefined,
	{
		$id: 'OracleTableSharedText2',
		description:
			'An OracleCollection representing a single table with multiple roll columns, and 2 shared text columns.'
	}
)
export type TOracleTableSharedText2 = typeof OracleTableSharedText2
export type OracleTableSharedText2 = Static<TOracleTableSharedText2>

export const OracleTableSharedText3 = Generic.CollectionSubtypeNode(
	Type.Object({
		column_labels: ColumnLabels<typeof OracleRollableRowText3>({})
	}),
	'oracle_collection',
	subtypeKey,
	'table_shared_text3' satisfies OracleCollectionType,
	Generic.Dictionary(Type.Ref(OracleColumnText3)),
	undefined,
	{
		$id: 'OracleTableSharedText3',
		description:
			'An OracleCollection representing a single table with multiple roll columns, and 3 shared text columns.'
	}
)
export type TOracleTableSharedText3 = typeof OracleTableSharedText3
export type OracleTableSharedText3 = Static<TOracleTableSharedText3>

export const OracleCollection = Utils.DiscriminatedUnion(
	{
		tables: OracleTablesCollection,
		table_shared_rolls: OracleTableSharedRolls,
		table_shared_text: OracleTableSharedText,
		table_shared_text2: OracleTableSharedText2,
		table_shared_text3: OracleTableSharedText3
	},
	subtypeKey,
	{ $id: 'OracleCollection' }
)

export type TOracleCollection = typeof OracleCollection
export type OracleCollection = Static<TOracleCollection>

