import { type TString, Type, type Static } from '@sinclair/typebox'
import { Id, Localize } from '../common/index.js'
import * as Utils from '../Utils.js'

export const DiceExpression = Type.RegExp(
	/([1-9][0-9]*)d([1-9][0-9]*)([+-]([1-9][0-9]*))?/,
	{
		$id: 'DiceExpression',
		description: 'A simple dice roll expression with an optional modifer.',
		examples: ['1d100', '1d6+2']
	}
) as TString & { pattern: string; static: DiceExpression }

export type DiceExpression =
	| `${number}d${number}`
	| `${number}d${number}${'+' | '-'}${number}`

export const OracleDuplicateBehavior = Utils.UnionEnumFromRecord(
	{
		reroll: 'Duplicates results should be re-rolled.',
		keep: 'Duplicates results should be kept.',
		make_it_worse:
			'Duplicates should be kept, and they compound to make things worse.'
	},
	{
		$id: 'OracleDuplicateBehavior',
		description:
			'Special roll instructions to use when rolling multiple times on a single oracle.'
	}
)
export type OracleDuplicateBehavior = Static<typeof OracleDuplicateBehavior>

export const OracleRoll = Type.Object(
	{
		oracle: Utils.Nullable(Type.Ref(Id.OracleRollableId), {
			default: null,
			description:
				"The ID of the oracle to be rolled. A `null` value indicates that it's a roll on the same table."
		}),
		auto: Type.Boolean({
			default: false,
			description:
				'Both Ironsworn and Starforged explicitly recommend *against* rolling all details at once. That said, some oracle results only provide useful information once a secondary roll occurs, such as "Action + Theme" or "Roll Twice".'
		}),
		duplicates: Type.Ref(OracleDuplicateBehavior, {
			description:
				'Special rules on how to handle duplicate results, when rolling multiple times.',
			default: 'reroll'
		}),
		dice: Utils.Nullable(Type.Ref(DiceExpression), {
			default: null,
			description:
				"The dice roll to make on the oracle table. Set it to `null` if you just want the table's default."
		}),
		// TODO: replace with the recommended_rolls?
		number_of_rolls: Type.Integer({
			minimum: 1,
			default: 1,
			description: 'The number of times to roll.'
		})
		// TODO: some way to handle e.g. 1d6 rolls?
	},
	{ $id: 'OracleRoll' }
)
export type OracleRoll = Static<typeof OracleRoll>
export type TOracleRoll = typeof OracleRoll

export const OracleRollTemplate = Type.Object(
	{
		result: Type.Optional(
			Type.Ref(Localize.TemplateString, {
				description:
					'A string template that may be used in place of OracleTableRow#result.',
				examples: [
					'{{result:starforged/oracles/factions/affiliation}} of the {{result:starforged/oracles/factions/legacy}} {{result:starforged/oracles/factions/identity}}'
				]
			})
		),
		detail: Type.Optional(
			Type.Ref(Localize.TemplateString, {
				description:
					'A string template that may be used in place of OracleTableRow#detail.'
			})
		),
		description: Type.Optional(
			Type.Ref(Localize.TemplateString, {
				description:
					'A string template that may be used in place of OracleTableRow#description.'
			})
		)
	},
	{
		$id: 'OracleRollTemplate',
		releaseStage: 'experimental',
		description: `Provides string templates that may be used in place of the static row text from \`OracleTableRow#result\`, \`OracleTableRow#detail\`, and \`OracleTableRow#description\`.

  These strings are formatted in Markdown, but use a special syntax for their placeholders: \`{{result:some_oracle_table_id}}\`. The placeholder should be replaced with the value of a rolled (or selected) \`OracleTableRow#result\` from the target oracle table ID.`
	}
)
export type OracleRollTemplate = Static<typeof OracleRollTemplate>

export const OracleMatchBehavior = Type.Object(
	{
		text: Type.Ref(Localize.MarkdownString)
	},
	{ $id: 'OracleMatchBehavior' }
)
export type OracleMatchBehavior = Static<typeof OracleMatchBehavior>
