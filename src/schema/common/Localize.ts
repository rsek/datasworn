import { Type, type Static } from '@sinclair/typebox'
import { UnionEnumFromRecord } from '../utils/UnionEnumFromRecord.js'

export const Label = Type.String({
	$id: 'Label',
	description:
		'A localized, player-facing name or label, formatted as plain text. In some contexts it may be undesirable to render this text, but it should always be exposed to assistive technology (e.g. with `aria-label` in HTML).',
	i18n: true
})
export type Label = Static<typeof Label>

export const MarkdownString = Type.String({
	$id: 'MarkdownString',
	description: `Localized, player-facing text, formatted in Markdown. It is *not* formatted for use "out of the box"; it uses some custom syntax, intended to be replaced in whatever way is most appropriate for your implementation.

* \`[Link text](move:starforged/suffer/pay_the_price)\`: A link to the identified object. The ID must conform to the \`AnyId\` type; no wildcards allowed.
* \`{{table>oracle_rollable:starforged/core/action}}\`: the referenced oracle is rendered here in the source material. The ID must conform to the \`AnyOracleRollableId\` type; no wildcards allowed.
`,
	format: 'markdown',
	i18n: true
})
export type MarkdownString = Static<typeof Label>

export const TemplateString = Type.String({
	$id: 'TemplateString',
	i18n: true,
	description: `A rich text string in Markdown with replaced values from oracle roll results.

The custom syntax \`{{some_row_key>some_oracle_table_id}}\` should be replaced by the \`some_row_key\` string of a rolled oracle table. This is usually the \`text\` key, for example \`{{text>oracle_rollable:starforged/core/action}}\`
`,
	format: 'markdown',
	releaseStage: 'experimental'
})
export type TemplateString = Static<typeof TemplateString>

export const PartOfSpeech = UnionEnumFromRecord(
	{
		common_noun: 'A common noun.',
		proper_noun: 'A proper noun.',
		adjunct_common_noun:
			'A common noun used as an adjective, to modify another noun.',
		adjunct_proper_noun:
			'A proper noun used as an adjective, to modify another noun.',
		verb: 'A verb in present tense',
		gerund:
			'Gerund or present participle of a verb, e.g. "going", "seeing", "waving". Can function as a noun, an adjective, or a progressive verb.',
		adjective: 'An adjective.',
		attributive_verb: 'A verb used as an adjective, to modify a noun.',
		adjective_as_proper_noun: 'An adjective used as a proper noun.',
		common_noun_as_proper_noun: 'An common noun used as a proper noun.'
	},
	{ $id: 'PartOfSpeech', releaseStage: 'experimental' }
)
export type PartOfSpeech = Static<typeof PartOfSpeech>

export const I18nHint = Type.Object(
	{
		part_of_speech: Type.Optional(
			Type.Ref(PartOfSpeech, {
				description: 'The part of speech for this string.'
			})
		)
	},
	{ $id: 'I18nHint', releaseStage: 'experimental' }
)
export type I18nHint = Static<typeof I18nHint>

export const I18nHints = Type.Object(
	{
		text: Type.Optional(Type.Ref(I18nHint)),
		text2: Type.Optional(Type.Ref(I18nHint)),
		text3: Type.Optional(Type.Ref(I18nHint)),
		template: Type.Optional(
			Type.Object({
				text: Type.Optional(Type.Ref(I18nHint)),
				text2: Type.Optional(Type.Ref(I18nHint)),
				text3: Type.Optional(Type.Ref(I18nHint))
			})
		)
	},
	{
		$id: 'I18nHints',
		description:
			'Internationalization/localization hints for the text content of this object.',
		releaseStage: 'experimental'
	}
)
export type I18nHints = Static<typeof I18nHints>
