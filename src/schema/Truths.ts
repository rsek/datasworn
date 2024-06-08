import { Type, type Static } from '@sinclair/typebox'
import { Id, Localize, Metadata } from './common/index.js'
import * as Generic from './Generic.js'
import * as TableRow from './oracles/TableRow.js'
import { DiceExpression } from './common/Rolls.js'
import { OracleRollable, OracleTableText } from './index.js'
import { DiceRange } from './common/Range.js'
import { Computed, Discriminable, DiscriminatedUnion } from './Utils.js'
import { EmbeddedNode } from './utils/EmbeddedNode.js'
import { Mapping } from './Symbols.js'
import { mapKeys, mapValues } from 'lodash-es'
import { pascalCase } from './utils/string.js'
import type { PascalCase } from 'type-fest'

// export const TruthOptionTableRow = Type.Omit(
// 	TableRow.OracleTableRowText,
// 	['_id'],
// 	{
// 		$id: 'TruthOptionTableRow'
// 	}
// )
// export type TruthOptionTableRow = Static<typeof TruthOptionTableRow>

export type TruthOption = Static<typeof TruthOption>

// TODO: generalize this to EmbeddedOracleRollable
// provide an ID union for it.
const oracleRollableMapping = mapValues(OracleRollable[Mapping], (schema) =>
	EmbeddedNode(schema, 'truth.option', [], { $id: 'TruthOption' + schema.$id })
)

export const {
	column_text: TruthOptionOracleColumnText,
	column_text2: TruthOptionOracleColumnText2,
	column_text3: TruthOptionOracleColumnText3,
	table_text: TruthOptionOracleTableText,
	table_text2: TruthOptionOracleTableText2,
	table_text3: TruthOptionOracleTableText3
} = oracleRollableMapping

export const TruthOptionOracleRollable = DiscriminatedUnion(
	oracleRollableMapping,
	'oracle_type',
	{ $id: 'TruthOptionOracleRollable' }
)

export type TruthOptionOracleRollable = Static<typeof TruthOptionOracleRollable>

export const TruthOption = Type.Object(
	{
		_id: Computed(Type.Ref(Id.TruthOptionId)),
		roll: Type.Ref(DiceRange),
		summary: Type.Optional(Type.Ref(Localize.MarkdownString)),
		description: Type.Ref(Localize.MarkdownString),
		quest_starter: Type.Ref(Localize.MarkdownString),
		oracles: Type.Optional(
			Generic.Dictionary(Type.Ref(TruthOptionOracleRollable), {
				title: 'TruthOptionOracles'
			})
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
