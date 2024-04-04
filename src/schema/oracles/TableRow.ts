import {
	Type,
	type ObjectOptions,
	type Static,
	type TObject,
	type TProperties,
	type TRef,
	type TSchema,
	CloneType
} from '@sinclair/typebox'
import { mapValues } from 'lodash-es'
import { JsonTypeDef } from '../Symbols.js'
import * as Generic from '../Generic.js'
import * as Utils from '../Utils.js'
import { Id, Localize, Metadata, Rolls } from '../common/index.js'
import {
	WithDefaults,
	setDescriptions,
	type PickByType
} from '../utils/typebox.js'
import type { ObjectProperties } from '../utils/ObjectProperties.js'
import JtdType from '../../scripts/json-typedef/typedef.js'

const TableRowBase = Type.Object({
	text: Type.Ref(Localize.MarkdownString, {
		description: 'The primary text content of this row.'
	}),
	icon: Type.Optional(Type.Ref(Metadata.SvgImageUrl)),
	oracle_rolls: Type.Optional(
		Type.Array(Type.Ref(Rolls.OracleRoll), {
			description: 'Further oracle rolls prompted by this table row.'
		})
	),
	suggestions: Type.Optional(Type.Ref(Metadata.Suggestions)),
	embed_table: Type.Optional(
		Type.Ref(Id.OracleRollableId, {
			releaseStage: 'experimental',
			description:
				'Hints that the identified table should be rendered inside this table row.'
		})
	),
	template: Type.Optional(
		Type.Ref(Rolls.OracleRollTemplate, { releaseStage: 'experimental' })
	),
	_i18n: Type.Optional(Type.Ref(Localize.I18nHints))
})

export const TableRowMixin = Utils.Assign([
	TableRowBase,
	Type.Object({
		min: Type.Integer({
			description: 'Low end of the dice range for this table row.',
			[JsonTypeDef]: {
				schema: JtdType.Int16()
			}
		}),
		max: Type.Integer({
			description: 'High end of the dice range for this table row.',
			[JsonTypeDef]: {
				schema: JtdType.Int16()
			}
		})
	})
])

export const TableRowNullableMixin = setDescriptions(
	Utils.SetNullable(TableRowMixin, ['min', 'max']),
	{
		min: 'Low end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.',
		max: 'High end of the dice range for this table row. `null` represents an unrollable row, included only for rendering purposes.'
	}
)

export type TTableRow<
	Min extends TSchema = TSchema,
	Max extends TSchema = TSchema,
	Props extends TProperties & { min: Min; max: Max } = { min: Min; max: Max }
> = TObject<ObjectProperties<typeof TableRowBase> & Props>

type TableRow<
	Min = number | null,
	Max = number | null,
	Props extends { min: Min; max: Max } = { min: Min; max: Max }
> = Props & Static<typeof TableRowBase>

export function StaticRowPartial<
	T extends Partial<Utils.CanBeLiteral<TableRow>>
>(
	literals: T,
	defaults: Partial<
		TableRow & {
			min?: number
			max?: number
		}
	> = {}
) {
	return WithDefaults(Utils.ObjectLiteral(literals), defaults as any, {
		additionalProperties: true
	})
}
// export const OracleTableRowBasic = Generic.IdentifiedNode(
// 	Type.Ref(Id.OracleTableRowId),
// 	CloneType(TableRowNullableMixin),
// 	{
// 		$id: 'OracleTableRowBasic',
// 		description: 'Represents a row in an oracle table.'
// 	}
// )
export const OracleTableRowText = CloneType(TableRowNullableMixin, {
	$id: 'OracleTableRowText',
	description: 'Represents a row in an oracle table, with a single text cell.'
})

export type OracleTableRowText = Static<typeof OracleTableRowText>

// export const OracleTableRowDetails = Generic.IdentifiedNode(
// 	Type.Ref(Id.OracleTableRowId),
// 	Utils.Assign([
// 		TableRowNullableMixin,
// 		Type.Object({
// 			detail: Utils.Nullable(Type.Ref(Localize.MarkdownString), {
// 				default: undefined,
// 				description:
// 					'The secondary text column for this row. More detailed than `result`. Use `null` to represent a cell with a blank or empty vlue.'
// 			})
// 		})
// 	]),
// 	{
// 		$id: 'OracleTableRowDetails',
// 		description:
// 			'Represents a row in an oracle table that provides additional details.'
// 	}
// )
export const OracleTableRowText2 = Utils.Assign(
	[
		TableRowNullableMixin,
		Type.Object({
			text2: Utils.Nullable(Type.Ref(Localize.MarkdownString), {
				default: undefined,
				description:
					'The secondary text for this row. Use `null` to represent a cell with a blank or empty vlue.'
			})
		})
	],
	{
		$id: 'OracleTableRowText2',
		description:
			'Represents a row in an oracle table that provides a secondary text field.'
	}
)
export type OracleTableRowText2 = Static<typeof OracleTableRowText2>

export const OracleTableRowText3 = Utils.Assign(
	[
		TableRowNullableMixin,
		Type.Object({
			text2: Utils.Nullable(Type.Ref(Localize.MarkdownString), {
				default: undefined,
				description:
					'The secondary text for this row. Use `null` to represent a cell with a blank or empty vlue.'
			}),
			text3: Utils.Nullable(Type.Ref(Localize.MarkdownString), {
				default: undefined,
				description:
					'The tertiary text for this row. Use `null` to represent a cell with a blank or empty vlue.'
			})
		})
	],
	{
		$id: 'OracleTableRowText3',
		description: 'Represents a row in an oracle table with 3 text cells.'
	}
)
export type OracleTableRowText3 = Static<typeof OracleTableRowText3>

type StringDefaultsFor<T extends TObject> = {
	[K in
		| keyof PickByType<
				T['properties'],
				| TRef<typeof Localize.Label>
				| Utils.TNullable<TRef<typeof Localize.Label>>
		  >
		| 'roll']: string | null
}
export function ColumnLabels<
	RowType extends TObject,
	Defaults extends Partial<StringDefaultsFor<RowType>> = Partial<
		StringDefaultsFor<RowType>
	>
>(defaults: Defaults, options: ObjectOptions = {}) {
	return Type.Object(
		mapValues(defaults, (v, k) =>
			Type.Ref(Localize.Label, !v ? {} : { default: v })
		),
		{
			description:
				'The label at the head of each table column. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row).',
			...options,
			title: 'ColumnLabels',
			default: defaults
		}
	)
}

export const TextColumnLabels = ColumnLabels<typeof OracleTableRowText>({
	roll: 'Roll',
	text: 'Result'
})
export const Text2ColumnLabels = ColumnLabels<typeof OracleTableRowText2>({
	roll: 'Roll',
	text: 'Result',
	text2: 'Details'
})

export const Text3ColumnLabels = ColumnLabels<typeof OracleTableRowText3>({
	// purposefully undefined, not really any *common* use cases we can make assumptions about
	roll: 'Roll',
	text: undefined,
	text2: undefined,
	text3: undefined
})

export const OracleTableRow = Type.Union(
	[
		Type.Ref(OracleTableRowText),
		Type.Ref(OracleTableRowText2),
		Type.Ref(OracleTableRowText3)
	],
	{ $id: 'OracleTableRow', [JsonTypeDef]: { skip: true } }
)

export type OracleTableRow = Static<typeof OracleTableRow>