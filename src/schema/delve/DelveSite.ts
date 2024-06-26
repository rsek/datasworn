import {
	Type,
	type Static,
	type TObject,
	type TLiteral
} from '@sinclair/typebox'
import { JsonTypeDef } from '../Symbols.js'
import { toJtdElements } from '../../scripts/json-typedef/utils.js'
import { Id, Localize, Metadata, Progress } from '../common/index.js'
import { StaticRowPartial } from '../oracles/TableRow.js'
import * as Utils from '../Utils.js'
import * as Generic from '../Generic.js'
import JtdType from '../../scripts/json-typedef/typedef.js'

export const DelveSiteDenizenFrequency = Utils.UnionEnum(
	['very_common', 'common', 'uncommon', 'rare', 'unforeseen'],
	{ $id: 'DelveSiteDenizenFrequency' }
)
export type DelveSiteDenizenFrequency = Static<typeof DelveSiteDenizenFrequency>

export const DelveSiteDenizen = Type.Object(
	{
		name: Type.Optional(
			Type.Ref(Localize.Label, {
				description:
					"A name for the denizen, if it's different than the `name` property of the NPC."
			})
		),
		min: Type.Integer({
			description: 'Low end of the dice range for this denizen.'
		}),
		max: Type.Integer({
			description: 'High end of the dice range for this denizen.'
		}),
		npc: Type.Optional(
			Type.Ref(Id.NpcId, {
				description: 'The ID of the relevant NPC entry, if one is specified.'
			})
		),
		frequency: Type.Ref(DelveSiteDenizenFrequency)
	},
	{
		$id: 'DelveSiteDenizen',
		description:
			'Represents an entry in a site denizen matrix. Denizen matrices are described in Ironsworn: Delve.'
	}
)
export type DelveSiteDenizen = Static<typeof DelveSiteDenizen>
function StaticDenizenRowStub<
	Min extends number,
	Max extends number,
	Frequency extends DelveSiteDenizenFrequency
>(min: Min, max: Max, frequency: Frequency) {
	return Utils.Assign(
		[
			StaticRowPartial({ min, max }),
			Type.Object({ frequency: Type.Literal(frequency) })
		],
		{ additionalProperties: true }
	) as TObject<{
		min: TLiteral<Min>
		max: TLiteral<Max>
		frequency: TLiteral<Frequency>
	}>
}
const DelveSiteDenizens = Type.Array(Type.Ref(DelveSiteDenizen))

export const DelveSite = Utils.setSourceDataSchema(
	Generic.SourcedNode(
		Type.Ref(Id.DelveSiteId),
		Type.Object({
			type: Type.Literal('delve_site'),
			icon: Type.Optional(Type.Ref(Metadata.SvgImageUrl)),
			rank: Type.Ref(Progress.ChallengeRank),
			region: Type.Optional(
				Type.Ref(Id.AtlasEntryId, {
					description:
						'The ID of an atlas entry representing the region in which this delve site is located.'
				})
			),
			theme: Type.Ref(Id.DelveSiteThemeId, {
				description: "The ID of the site's DelveSiteTheme card."
			}),
			domain: Type.Ref(Id.DelveSiteDomainId, {
				description: "The ID of the site's DelveSiteDomain card."
			}),
			extra_card: Type.Optional(
				Type.Union(
					[Type.Ref(Id.DelveSiteThemeId), Type.Ref(Id.DelveSiteDomainId)],
					{
						description:
							'An additional theme or domain card ID, for use with optional rules in Ironsworn: Delve.',
						[JsonTypeDef]: { schema: JtdType.String() }
					}
				)
			),
			description: Type.Ref(Localize.MarkdownString),
			denizens: Type.Intersect(
				[
					DelveSiteDenizens,
					Type.Tuple([
						StaticDenizenRowStub(1, 27, 'very_common'),
						StaticDenizenRowStub(28, 41, 'common'),
						StaticDenizenRowStub(42, 55, 'common'),
						StaticDenizenRowStub(56, 69, 'common'),
						StaticDenizenRowStub(70, 75, 'uncommon'),
						StaticDenizenRowStub(76, 81, 'uncommon'),
						StaticDenizenRowStub(82, 87, 'uncommon'),
						StaticDenizenRowStub(88, 93, 'uncommon'),
						StaticDenizenRowStub(94, 95, 'rare'),
						StaticDenizenRowStub(96, 97, 'rare'),
						StaticDenizenRowStub(98, 99, 'rare'),
						StaticDenizenRowStub(100, 100, 'unforeseen')
					])
				],
				{
					[JsonTypeDef]: {
						schema: toJtdElements(DelveSiteDenizens)
					},
					rollable: '1d100',
					description:
						"Represents the delve site's denizen matrix as an array of objects."
				}
			)
		}),
		{
			$id: 'DelveSite',
			description: 'A delve site with a theme, domain, and denizens.'
		}
	),
	(schema) => ({ ...schema, additionalProperties: true })
)

export type DelveSite = Static<typeof DelveSite>
export type TDelveSite = typeof DelveSite
