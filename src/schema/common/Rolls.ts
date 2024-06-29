import { type TString, Type, type Static } from '@sinclair/typebox'
import * as Utils from '../Utils.js'
import * as Localize from './Localize.js'
import Id from './Id.js'

export const DiceExpression = Type.String({
	pattern: /([1-9][0-9]*)d([1-9][0-9]*)([+-]([1-9][0-9]*))?/.source,
	$id: 'DiceExpression',
	description: 'A simple dice roll expression with an optional modifer.',
	examples: ['1d100', '1d6+2']
}) as TString & { pattern: string; static: DiceExpression }

export type DiceExpression =
	| `${number}d${number}`
	| `${number}d${number}${'+' | '-'}${number}`

export const OracleDuplicateBehavior = Utils.UnionEnumFromRecord(
	{
		reroll: 'Duplicate results should be re-rolled.',
		keep: 'Duplicates results should be kept.',
		make_it_worse:
			'Duplicate results should be kept, and they compound to make things worse.'
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
				'Both Ironsworn and Starforged explicitly recommend *against* rolling all details at once. That said, some oracle results only provide useful information once a secondary roll occurs, such as "Action + Theme" or "Roll twice".'
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
		text: Type.Optional(
			Type.Ref(Localize.TemplateString, {
				description:
					'A string template that may be used in place of OracleRollableRow#text.',
				examples: [
					'{{text>oracle_rollable:starforged/faction/name/affiliation}} of the {{text>oracle_rollable:starforged/faction/name/legacy}} {{text>oracle_rollable:starforged/faction/name/identity}}'
				]
			})
		),
		text2: Type.Optional(
			Type.Ref(Localize.TemplateString, {
				description:
					'A string template that may be used in place of OracleRollableRow#text2.'
			})
		),
		text3: Type.Optional(
			Type.Ref(Localize.TemplateString, {
				description:
					'A string template that may be used in place of OracleRollableRow#text3.'
			})
		)
	},
	{
		$id: 'OracleRollTemplate',
		releaseStage: 'experimental',
		description: `Provides string templates that may be used in place of the static row text from \`OracleRollableRow#text\`, \`OracleRollableRow#text2\`, and \`OracleRollableRow#text3\`.

  These strings are formatted in Markdown, but use a special syntax for their placeholders: \`{{text>some_oracle_rollable_id}}\`. The placeholder should be replaced with the value of a rolled (or selected) \`OracleRollableRow#text\` from the target oracle rollable ID.`
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
