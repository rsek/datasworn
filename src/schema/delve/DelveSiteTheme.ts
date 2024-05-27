import { Type, type Static, CloneType } from '@sinclair/typebox'
import { JsonTypeDef } from '../Symbols.js'
import { toJtdElements } from '../../scripts/json-typedef/utils.js'
import { Id, Localize, Metadata } from '../common/index.js'
import {
	OracleTableRowText,
	StaticRowPartial,
	TableRowMixin
} from '../oracles/TableRow.js'
import * as Generic from '../Generic.js'
import { setSourceDataSchema } from '../Utils.js'

// export const DelveSiteThemeFeatureRow = CloneType(TableRowMixin, {
// 	$id: 'DelveSiteThemeFeatureRow',
// 	description: 'Represents a single Feature entry from a delve site Theme card.'
// })
// export type DelveSiteThemeFeatureRow = Static<typeof DelveSiteThemeFeatureRow>

// export const DelveSiteThemeDangerRow = CloneType(TableRowMixin, {
// 	$id: 'DelveSiteThemeDangerRow',
// 	description: 'Represents a single Danger entry from a delve site Theme card.'
// })
// export type DelveSiteThemeDangerRow = Static<typeof DelveSiteThemeDangerRow>

// const DelveSiteThemeFeatures = Type.Array(Type.Ref(DelveSiteThemeFeatureRow))
// const DelveSiteThemeDangers = Type.Array(Type.Ref(DelveSiteThemeDangerRow))

const DelveSiteThemeFeatures = Type.Array(Type.Ref(OracleTableRowText))
const DelveSiteThemeDangers = Type.Array(Type.Ref(OracleTableRowText))

export const DelveSiteTheme = setSourceDataSchema(
	Generic.SourcedNode(
		Type.Ref(Id.DelveSiteThemeId),
		Type.Object({
			type: Type.Literal('delve_site_theme'),
			summary: Type.Ref(Localize.MarkdownString),
			description: Type.Optional(Type.Ref(Localize.MarkdownString)),
			icon: Type.Optional(Type.Ref(Metadata.SvgImageUrl)),
			features: Type.Intersect(
				[
					DelveSiteThemeFeatures,
					Type.Tuple([
						StaticRowPartial(1, 4),
						StaticRowPartial(5, 8),
						StaticRowPartial(9, 12),
						StaticRowPartial(13, 16),
						StaticRowPartial(17, 20)
					])
				],
				{
					[JsonTypeDef]: {
						schema: toJtdElements(DelveSiteThemeFeatures)
					}
				}
			),
			dangers: Type.Intersect(
				[
					DelveSiteThemeDangers,
					Type.Tuple([
						StaticRowPartial(1, 5),
						StaticRowPartial(6, 10),
						StaticRowPartial(11, 12),
						StaticRowPartial(13, 14),
						StaticRowPartial(15, 16),
						StaticRowPartial(17, 18),
						StaticRowPartial(19, 20),
						StaticRowPartial(21, 22),
						StaticRowPartial(23, 24),
						StaticRowPartial(25, 26),
						StaticRowPartial(27, 28),
						StaticRowPartial(29, 30)
					])
				],
				{
					[JsonTypeDef]: {
						schema: toJtdElements(DelveSiteThemeDangers)
					}
				}
			)
		}),
		{
			description: 'A delve site theme card.',
			$id: 'DelveSiteTheme'
		}
	),
	(schema) => ({ ...schema, additionalProperties: true })
)
export type DelveSiteTheme = Static<typeof DelveSiteTheme>
export type TDelveSiteTheme = typeof DelveSiteTheme
