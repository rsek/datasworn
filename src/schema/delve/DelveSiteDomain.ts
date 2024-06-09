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

// export const DelveSiteDomainFeatureRow = CloneType(TableRowMixin, {
// 	$id: 'DelveSiteDomainFeatureRow',
// 	description:
// 		'Represents a single Feature entry from a delve site Domain card.'
// })
// export type DelveSiteDomainFeatureRow = Static<typeof DelveSiteDomainFeatureRow>
// export const DelveSiteDomainDangerRow = CloneType(TableRowMixin, {
// 	$id: 'DelveSiteDomainDangerRow',
// 	description: 'Represents a single Danger entry from a delve site Domain card.'
// })
// export type DelveSiteDomainDangerRow = Static<typeof DelveSiteDomainDangerRow>

// const DelveSiteDomainFeatures = Type.Array(Type.Ref(DelveSiteDomainFeatureRow))
const DelveSiteDomainFeatures = Type.Array(Type.Ref(OracleTableRowText))

// const DelveSiteDomainDangers = Type.Array(Type.Ref(DelveSiteDomainDangerRow))
const DelveSiteDomainDangers = Type.Array(Type.Ref(OracleTableRowText))

export const DelveSiteDomain = setSourceDataSchema(
	Generic.SourcedNode(
		Type.Ref(Id.DelveSiteDomainId),
		Type.Object({
			type: Type.Literal('delve_site_domain'),
			summary: Type.Ref(Localize.MarkdownString, { deprecated: true }),
			description: Type.Optional(Type.Ref(Localize.MarkdownString)),
			// icon: Type.Optional(Type.Ref(Metadata.SvgImageUrl)),
			name_oracle: Type.Optional(
				Type.Ref(Id.OracleRollableId, {
					description:
						'An oracle table ID containing place name elements. For examples, see oracle ID `oracle_rollable:delve/site_name/place/barrow`, and its siblings in oracle collection ID `oracle_collection:delve/site_name/place`. These oracles are used by the site name oracle from Ironsworn: Delve (`oracle_rollable:delve/site_name/format`) to create random names for delve sites.'
				})
			),
			features: Type.Intersect(
				[
					DelveSiteDomainFeatures,
					Type.Tuple([
						StaticRowPartial(21, 43),
						StaticRowPartial(44, 56),
						StaticRowPartial(57, 64),
						StaticRowPartial(65, 68),
						StaticRowPartial(69, 72),
						StaticRowPartial(73, 76),
						StaticRowPartial(77, 80),
						StaticRowPartial(81, 84),
						StaticRowPartial(85, 88),
						StaticRowPartial(
							// FIXME: disabled for now because the defaults make TypeCompiler upset
							89,
							98

							// {
							// 	result: 'Something unusual or unexpected',
							// 	suggestions: {
							// 		oracles: [
							// 			'delve/oracles/feature/aspect',
							// 			'delve/oracles/feature/focus'
							// 		]
							// 	}
							// }
						),
						StaticRowPartial(
							99,
							99
							// {
							// result: 'You transition into a new theme'
							// suggestions: {
							// 	oracles: ['delve/oracles/site_nature/theme']
							// }
							// }
						),
						StaticRowPartial(
							100,
							100
							// {
							// 	result: 'You transition into a new domain',
							// 	suggestions: {
							// 		oracles: ['delve/oracles/site_nature/domain']
							// 	}
							// }
						)
					])
				],
				{
					[JsonTypeDef]: {
						schema: toJtdElements(DelveSiteDomainFeatures)
					}
				}
			),
			dangers: Type.Intersect(
				[
					DelveSiteDomainDangers,
					Type.Tuple([
						StaticRowPartial(31, 33),
						StaticRowPartial(34, 36),
						StaticRowPartial(37, 39),
						StaticRowPartial(40, 42),
						StaticRowPartial(43, 45)
					])
				],
				{
					[JsonTypeDef]: {
						schema: toJtdElements(DelveSiteDomainDangers)
					}
				}
			)
		}),
		{
			$id: 'DelveSiteDomain',
			description: 'A delve site Domain card.'
		}
	),
	(schema) => ({ ...schema, additionalProperties: true })
)

export type DelveSiteDomain = Static<typeof DelveSiteDomain>
export type TDelveSiteDomain = typeof DelveSiteDomain
