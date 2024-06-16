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
import { Tags } from '../Rules.js'
import { DiceRange, StaticDiceRange } from '../common/Range.js'
import type { SetRequired } from 'type-fest'
import { Assign } from '../utils/FlatIntersect.js'

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
	_i18n: Type.Optional(
		Type.Ref(Localize.I18nHints, {
			releaseStage: 'experimental'
		})
	)
})

export const TableRowMixin = Assign(
	TableRowBase,
	Type.Object({
		roll: Type.Ref(DiceRange),
		tags: Type.Optional(Type.Ref<typeof Tags>('Tags')),
		_id: Utils.Computed(Type.Ref('AnyOracleRollableRowId'))
	})
)

export const TableRowNullableMixin = setDescriptions(
	Utils.SetNullable(TableRowMixin, ['roll']),
	{
		roll: '`null` represents an unrollable row, included only for rendering purposes.'
	}
)

export type TTableRow<Roll extends TSchema = TSchema> = TObject<
	ObjectProperties<typeof TableRowBase> & { roll: Roll }
>

type TableRow<
	Roll = { min: number; max: number } | null,
	Props extends { roll: Roll } = { roll: Roll }
> = Props & Static<typeof TableRowBase>

export function StaticRowPartial(min: number, max: number) {
	return Type.Object(
		{ roll: StaticDiceRange(min, max) },
		{ additionalProperties: true }
	)
}

export const OracleRollableRowText = CloneType(TableRowNullableMixin, {
	$id: 'OracleRollableRowText',
	description: 'Represents a row in an oracle table, with a single text cell.'
})

export type OracleRollableRowText = Static<typeof OracleRollableRowText>

export const OracleRollableRowText2 = Assign(
	TableRowNullableMixin,
	Type.Object({
		text2: Utils.Nullable(Type.Ref(Localize.MarkdownString), {
			default: undefined,
			description:
				'The secondary text for this row. Use `null` to represent a cell with a blank or empty vlue.'
		})
	}),
	{
		$id: 'OracleRollableRowText2',
		description:
			'Represents a row in an oracle table that provides a secondary text field.'
	}
)
export type OracleRollableRowText2 = Static<typeof OracleRollableRowText2>

export const OracleRollableRowText3 = Assign(
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
	}),
	{
		$id: 'OracleRollableRowText3',
		description: 'Represents a row in an oracle table with 3 text cells.'
	}
)
export type OracleRollableRowText3 = Static<typeof OracleRollableRowText3>

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

export const TextColumnLabels = ColumnLabels<typeof OracleRollableRowText>({
	roll: 'Roll',
	text: 'Result'
})
export const Text2ColumnLabels = ColumnLabels<typeof OracleRollableRowText2>({
	roll: 'Roll',
	text: 'Result',
	text2: 'Details'
})

export const Text3ColumnLabels = ColumnLabels<typeof OracleRollableRowText3>({
	roll: undefined,
	text: undefined,
	text2: undefined,
	text3: undefined
})

export const OracleRollableRow = Type.Union(
	[
		Type.Ref(OracleRollableRowText),
		Type.Ref(OracleRollableRowText2),
		Type.Ref(OracleRollableRowText3)
	],
	{ $id: 'OracleRollableRow', [JsonTypeDef]: { skip: true } }
)

export type OracleRollableRow = Static<typeof OracleRollableRow>