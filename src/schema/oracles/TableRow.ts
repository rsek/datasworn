import {
	CloneType,
	Type,
	type Static,
	type TObject,
	type TRefUnsafe,
	type TSchema
} from '@sinclair/typebox'
import type { Tags } from '../Rules.js'
import { JsonTypeDef } from '../Symbols.js'
import * as Utils from '../Utils.js'
import { DiceRange, StaticDiceRange } from '../common/Range.js'

import Id from '../common/Id.js'

import * as Text from '../common/Text.js'

import * as Metadata from '../common/Metadata.js'

import * as Rolls from '../common/Rolls.js'
import { Assign } from '../utils/FlatIntersect.js'
import type { ObjectProperties } from '../utils/ObjectProperties.js'
import { setDescriptions, type PickByType } from '../utils/typebox.js'

const TableRowBase = Type.Object({
	text: Type.Ref(Text.MarkdownString, {
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
		Type.Ref(Text.I18nHints, {
			releaseStage: 'experimental'
		})
	)
})

export const TableRowMixin = Assign(
	TableRowBase,
	Type.Object({
		roll: Type.Ref(DiceRange),
		tags: Type.Optional(Type.Ref('Tags')),
		_id: Utils.Computed(Type.Ref('AnyOracleRollableRowId'))
	})
)

export const TableRowNullableMixin = setDescriptions(
	Utils.SetNullable(TableRowMixin, ['roll'], { defaultToNull: true }),
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
		text2: Utils.Nullable(Type.Ref(Text.MarkdownString), {
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
		text2: Utils.Nullable(Type.Ref(Text.MarkdownString), {
			description:
				'The secondary text for this row. Use `null` to represent a cell with a blank or empty value.'
		}),
		text3: Utils.Nullable(Type.Ref(Text.MarkdownString), {
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
				TRefUnsafe<typeof Text.Label> | Utils.TNullable<TRefUnsafe<typeof Text.Label>>
		  >
		| 'roll']: string | null
}

export const OracleRollableRow = Type.Union(
	[
		Type.Ref(OracleRollableRowText),
		Type.Ref(OracleRollableRowText2),
		Type.Ref(OracleRollableRowText3)
	],
	{ $id: 'OracleRollableRow', [JsonTypeDef]: { skip: true } }
)

export type OracleRollableRow = Static<typeof OracleRollableRow>
