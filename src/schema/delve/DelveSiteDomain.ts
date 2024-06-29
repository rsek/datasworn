import { Type, type Static } from '@sinclair/typebox'
import { toJtdElements } from '../../scripts/json-typedef/utils.js'
import { JsonTypeDef } from '../Symbols.js'
import { setSourceDataSchema } from '../Utils.js'
import Id from '../common/Id.js'
import { NonCollectableNode } from '../generic/NonCollectableNode.js'
import { OracleRollableRowText, StaticRowPartial } from '../oracles/TableRow.js'
import { EmbeddedType } from './common.js'

export const DelveSiteDomainFeature = EmbeddedType(
	OracleRollableRowText,
	'delve_site_domain',
	'feature',
	{
		description:
			'Represents a single Feature entry from a delve site Domain card.'
	}
)
export const DelveSiteDomainDanger = EmbeddedType(
	OracleRollableRowText,
	'delve_site_domain',
	'danger',
	{
		description:
			'Represents a single Danger entry from a delve site Domain card.'
	}
)

const DelveSiteDomainFeatures = Type.Array(Type.Ref(DelveSiteDomainFeature))

// const DelveSiteDomainDangers = Type.Array(Type.Ref(DelveSiteDomainDangerRow))
const DelveSiteDomainDangers = Type.Array(Type.Ref(DelveSiteDomainDanger))

export const DelveSiteDomain = setSourceDataSchema(
	NonCollectableNode(
		Type.Object({
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
		'delve_site_domain',
		{
			$id: 'DelveSiteDomain',
			description: 'A delve site Domain card.'
		}
	),
	(schema) => ({ ...schema, additionalProperties: true })
)

export type DelveSiteDomain = Static<typeof DelveSiteDomain>
export type TDelveSiteDomain = typeof DelveSiteDomain
