import { Type, type Static } from '@sinclair/typebox'
import { toJtdElements } from '../../scripts/json-typedef/utils.js'
import { JsonTypeDef } from '../Symbols.js'
import { setSourceDataSchema } from '../Utils.js'
import { NonCollectableNode } from '../generic/NonCollectableNode.js'
import { OracleRollableRowText, StaticRowPartial } from '../oracles/TableRow.js'
import { EmbeddedType } from './common.js'

export const DelveSiteThemeFeature = EmbeddedType(
	OracleRollableRowText,
	'delve_site_theme',
	'feature',

	{
		description:
			'Represents a single Feature entry from a delve site Theme card.'
	}
)
export const DelveSiteThemeDanger = EmbeddedType(
	OracleRollableRowText,
	'delve_site_theme',
	'danger',

	{
		description:
			'Represents a single Danger entry from a delve site Theme card.'
	}
)

const DelveSiteThemeFeatures = Type.Array(Type.Ref(DelveSiteThemeFeature))
const DelveSiteThemeDangers = Type.Array(Type.Ref(DelveSiteThemeDanger))

export const DelveSiteTheme = setSourceDataSchema(
	NonCollectableNode(
		Type.Object({
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
		'delve_site_theme',
		{
			description: 'A delve site theme card.',
			$id: 'DelveSiteTheme'
		}
	),
	(schema) => ({ ...schema, additionalProperties: true })
)
export type DelveSiteTheme = Static<typeof DelveSiteTheme>
export type TDelveSiteTheme = typeof DelveSiteTheme
