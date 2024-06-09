import { Type, type Static } from '@sinclair/typebox'
import { Id, Localize, Metadata } from './common/index.js'
import * as Generic from './Generic.js'
import * as TableRow from './oracles/TableRow.js'
import { DiceExpression } from './common/Rolls.js'
import { OracleTableText } from './index.js'
import { DiceRange } from './common/Range.js'
import { Computed, Discriminable } from './Utils.js'
import { mapKeys } from 'lodash-es'
import { pascalCase } from './utils/string.js'
import type { PascalCase } from 'type-fest'
import { EmbeddedOracleRollable } from './oracles/EmbeddedOracleRollable.js'

// export const TruthOptionTableRow = Type.Omit(
// 	TableRow.OracleTableRowText,
// 	['_id'],
// 	{
// 		$id: 'TruthOptionTableRow'
// 	}
// )
// export type TruthOptionTableRow = Static<typeof TruthOptionTableRow>

export type TruthOption = Static<typeof TruthOption>

export const TruthOption = Type.Object(
	{
		_id: Computed(Type.Ref(Id.TruthOptionId)),
		roll: Type.Ref(DiceRange),
		summary: Type.Optional(Type.Ref(Localize.MarkdownString)),
		description: Type.Ref(Localize.MarkdownString),
		quest_starter: Type.Ref(Localize.MarkdownString),
		oracles: Type.Optional(
			Generic.Dictionary(
				Type.Ref(EmbeddedOracleRollable, {
					title: 'TruthOptionOracleRollable'
				}),
				{
					title: 'TruthOptionOracles'
				}
			)
		)
	},
	{ $id: 'TruthOption' }
)

export const Truth = Discriminable(
	Generic.SourcedNode(
		Type.Ref(Id.TruthId),
		Type.Object({
			dice: Type.Ref(DiceExpression, { default: '1d100' }),
			icon: Type.Optional(Type.Ref(Metadata.SvgImageUrl)),
			summary: Type.Optional(Type.Ref(Localize.MarkdownString)),
			options: Type.Array(Type.Ref(TruthOption), { rollable: true }),
			your_character: Type.Optional(Type.Ref(Localize.MarkdownString))
		})
	),
	'type',
	'truth',
	{
		$id: 'Truth',
		description: 'A setting truth category.'
	}
)

export type Truth = Static<typeof Truth>
export type TTruth = typeof Truth
