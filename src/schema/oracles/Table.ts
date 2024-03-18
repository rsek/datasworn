import { Type, CloneType, type TObject } from '@sinclair/typebox'
import { Localize, Metadata } from '../common/index.js'
import { type ColumnLabels } from './TableRow.js'

// metadata relevant to presenting a table
export const TableMeta = Type.Object({
	recommended_rolls: Type.Optional(
		Type.Object({
			min: Type.Integer({ default: 1 }),
			max: Type.Integer({ default: 1 })
		})
	),
	icon: Type.Optional(
		Type.Ref(Metadata.SvgImageUrl, {
			description: 'An icon that represents this table.'
		})
	),
	summary: Type.Optional(
		Type.Ref(Localize.MarkdownString, {
			description:
				'A brief summary of the oracle table\'s intended usage, no more than a few sentences in length. This is intended for use in application tooltips and similar sorts of hints. Longer text should use the "description" key instead.'
		})
	),
	description: Type.Optional(
		Type.Ref(Localize.MarkdownString, {
			description:
				"A longer description of the oracle table's intended usage, which might include multiple paragraphs. If it's only a couple sentences, use the `summary` key instead."
		})
	)
})

export function TableMixin<OracleRow extends TObject>(
	column_labels: ReturnType<typeof ColumnLabels<OracleRow>>
) {
	return Type.Object({
		...CloneType(TableMeta).properties,
		column_labels
	})
}
