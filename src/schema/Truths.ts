import { Type, type Static } from '@sinclair/typebox'
import { Id, Localize, Metadata } from './common/index.js'
import * as Generic from './Generic.js'
import * as TableRow from './oracles/TableRow.js'
import { DiceExpression } from './common/Rolls.js'
import { OracleTableText } from './index.js'

// export const TruthOptionTableRow = Type.Omit(
// 	TableRow.OracleTableRowText,
// 	['_id'],
// 	{
// 		$id: 'TruthOptionTableRow'
// 	}
// )
// export type TruthOptionTableRow = Static<typeof TruthOptionTableRow>

const RollableStub = Type.Pick(OracleTableText, [])

export const TruthOption = Type.Object(
	{
		min: Type.Optional(Type.Integer()),
		max: Type.Optional(Type.Integer()),
		summary: Type.Optional(Type.Ref(Localize.MarkdownString)),
		description: Type.Ref(Localize.MarkdownString),
		quest_starter: Type.Ref(Localize.MarkdownString),
		// TODO: this should probably be a proper table object so that custom dice can be specified...
		table: Type.Optional(Type.Array(Type.Ref(TableRow.OracleTableRowText)))
	},
	{ $id: 'TruthOption' }
)

export type TruthOption = Static<typeof TruthOption>

export const Truth = Generic.SourcedNode(
	Type.Ref(Id.TruthId),
	Type.Object({
		dice: Type.Ref(DiceExpression, { default: '1d100' }),
		icon: Type.Optional(Type.Ref(Metadata.SvgImageUrl)),
		summary: Type.Optional(Type.Ref(Localize.MarkdownString)),
		options: Type.Array(Type.Ref(TruthOption), { rollable: true }),
		your_character: Type.Optional(Type.Ref(Localize.MarkdownString))
	}),
	{
		$id: 'Truth',
		description: 'A setting truth category.'
	}
)

export type Truth = Static<typeof Truth>
export type TTruth = typeof Truth
