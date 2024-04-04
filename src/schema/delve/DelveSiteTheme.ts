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

export const DelveSiteTheme = Generic.SourcedNode(
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
					StaticRowPartial({ min: 1, max: 4 }),
					StaticRowPartial({ min: 5, max: 8 }),
					StaticRowPartial({ min: 9, max: 12 }),
					StaticRowPartial({ min: 13, max: 16 }),
					StaticRowPartial({ min: 17, max: 20 })
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
					StaticRowPartial({ min: 1, max: 5 }),
					StaticRowPartial({ min: 6, max: 10 }),
					StaticRowPartial({ min: 11, max: 12 }),
					StaticRowPartial({ min: 13, max: 14 }),
					StaticRowPartial({ min: 15, max: 16 }),
					StaticRowPartial({ min: 17, max: 18 }),
					StaticRowPartial({ min: 19, max: 20 }),
					StaticRowPartial({ min: 21, max: 22 }),
					StaticRowPartial({ min: 23, max: 24 }),
					StaticRowPartial({ min: 25, max: 26 }),
					StaticRowPartial({ min: 27, max: 28 }),
					StaticRowPartial({ min: 29, max: 30 })
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
)
export type DelveSiteTheme = Static<typeof DelveSiteTheme>
export type TDelveSiteTheme = typeof DelveSiteTheme
