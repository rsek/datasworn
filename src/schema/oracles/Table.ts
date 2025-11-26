import {
	Type,
	type ObjectOptions,
	type Static,
	type TObject,
	type TRefUnsafe,
	type TString
} from '@sinclair/typebox'
import { Label, MarkdownString } from '../common/Text.js'
import { FlatIntersect } from '../utils/FlatIntersect.js'
import type { OracleRollableRowText3 } from './TableRow.js'
import { omit } from 'lodash-es'

// metadata relevant to presenting a table
export const TableMeta = Type.Object({
	recommended_rolls: Type.Optional(
		Type.Object({
			min: Type.Integer({ default: 1 }),
			max: Type.Integer({ default: 1 })
		})
	),

	summary: Type.Optional(
		Type.Ref(MarkdownString, {
			description:
				'A brief summary of the oracle table\'s intended usage, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.'
		})
	),
	description: Type.Optional(
		Type.Ref(MarkdownString, {
			description:
				"A longer description of the oracle table's intended usage, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead."
		})
	)
})

export function TableMixin<OracleRow extends TObject>(
	column_labels: ReturnType<typeof ColumnLabels>
) {
	return FlatIntersect([
		TableMeta,
		Type.Object({
			column_labels
		})
	])
}
function ColumnLabels<
	TextKeys extends [...(keyof Static<typeof OracleRollableRowText3>)[]]
>(textKeys: TextKeys, options: ObjectOptions = {}) {
	const props = {
		roll: Type.Ref(Label)
	} as Record<'roll' | TextKeys[number], TRefUnsafe<TString>>
	for (const k of textKeys) props[k as keyof typeof props] = Type.Ref(Label)

	return Type.Object(props, options)
}

export const TextColumnLabels = ColumnLabels(['text'], {
	title: 'TextColumnLabels',
	default: { roll: 'Roll', text: 'Result' }
})
export const Text2ColumnLabels = ColumnLabels(['text', 'text2'], {
	title: 'Text2ColumnLabels',
	default: {
		roll: 'Roll',
		text: 'Result',
		text2: 'Details'
	}
})

export const Text3ColumnLabels = ColumnLabels(['text', 'text2', 'text3'], {
	title: 'Text3ColumnLabels'
})

export const SharedRollsLabels = Type.Omit(TextColumnLabels, ['text'], {
	default: omit(TextColumnLabels.default, ['text']),
	description:
		'Provides column labels for this table. The `roll` key refers to the roll column showing the dice range (`min` and `max` on each table row). For all other column labels, see the `name` property of each child `OracleColumn`.',
	title: 'SharedRollsLabels'
})
export const SharedTextLabels = Type.Omit(TextColumnLabels, ['roll'], {
	default: omit(TextColumnLabels.default, ['roll']),
	title: 'SharedTextLabels'
})

export const SharedText2Labels = Type.Omit(Text2ColumnLabels, ['roll'], {
	default: omit(Text2ColumnLabels.default, ['roll']),
	title: 'SharedText2Labels'
})

export const SharedText3Labels = Type.Omit(Text3ColumnLabels, ['roll'], {
	default: omit(Text3ColumnLabels.default, ['roll']),
	title: 'SharedText3Labels'
})
