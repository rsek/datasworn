import {
	Type,
	type ObjectOptions,
	type ObjectProperties,
	type Static,
	type TObject,
	type TProperties,
	type TRef,
	type TSchema,
	TypeClone
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
import JtdType from '../../scripts/json-typedef/typedef.js'

const TableRowBase = Type.Object({
	result: Type.Ref(Localize.MarkdownString, {
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
	i18n: Type.Optional(Type.Ref(Localize.I18nHints))
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
export const OracleTableRowSimple = Generic.IdentifiedNode(
	Type.Ref(Id.OracleTableRowId),
	TypeClone.Type(TableRowNullableMixin),
	{
		$id: 'OracleTableRowSimple',
		description: 'Represents a row in an oracle table.'
	}
)

export type OracleTableRowSimple = Static<typeof OracleTableRowSimple>

export const OracleTableRowDetails = Generic.IdentifiedNode(
	Type.Ref(Id.OracleTableRowId),
	Utils.Assign([
		TableRowNullableMixin,
		Type.Object({
			detail: Utils.Nullable(Type.Ref(Localize.MarkdownString), {
				default: undefined,
				description:
					'The secondary text column for this row. More detailed than `result`. Use `null` to represent a cell with a blank or empty vlue.'
			})
		})
	]),
	{
		$id: 'OracleTableRowDetails',
		description:
			'Represents a row in an oracle table that provides additional details.'
	}
)
export type OracleTableRowDetails = Static<typeof OracleTableRowDetails>

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
			default: defaults
		}
	)
}

export const SimpleRowLabels = ColumnLabels<typeof OracleTableRowSimple>({
	roll: 'Roll',
	result: 'Result'
})
export const DetailsRowLabels = ColumnLabels<typeof OracleTableRowDetails>({
	roll: 'Roll',
	result: 'Result',
	detail: 'Detail'
})
