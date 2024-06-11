import { Type, type Static } from '@sinclair/typebox'
import * as Generic from './Generic.js'
import { Computed, Discriminable } from './Utils.js'
import { DiceRange } from './common/Range.js'
import { DiceExpression } from './common/Rolls.js'
import { Id, Localize, Metadata } from './common/index.js'
import { EmbeddedOracleRollable } from './oracles/EmbeddedOracleRollable.js'
import { EntityPrompt } from './entities/EntityPrompt.js'

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
			your_character: Type.Optional(Type.Ref(Localize.MarkdownString)),
			factions: Type.Optional(
				Type.Array(Type.Ref(EntityPrompt), {
					description:
						'Prompts for factions related to this truth, like those presented in standard isles. This is presented as a single paragraph in the original text; Datasworn uses an array (one faction prompt per string) to represent them in order to make them more suitable for programmatic use.\n\nThis property is a placeholder and may see signficant changes in v0.2.0.',
					releaseStage: 'experimental'
				})
			)
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
