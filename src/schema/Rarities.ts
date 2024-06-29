import { Type, type Static } from '@sinclair/typebox'
import { setSourceDataSchema } from './Utils.js'
import Id from './common/Id.js'
import { NonCollectableNode } from './Generic.js'

export const Rarity = setSourceDataSchema(
	NonCollectableNode(
		Type.Object({
			asset: Type.Ref(Id.AssetId, {
				description: 'The asset augmented by this rarity.'
			}),
			xp_cost: Type.Integer({
				minimum: 3,
				maximum: 5,
				default: 3,
				description: `From Ironsworn: Delve, p. 174:

      Some assets will bring a rarity into play more often than others, so the experience point cost for a rarity will vary by the linked asset. These costs are shown in the tables on page 175.

      If you are playing solo, and aren’t concerned with the relative balance of rarity abilities, you can ignore these variable costs. If so, spend 3 experience points to purchase a rarity.`
			})
		}),
		'rarity',
		{
			$id: 'Rarity',
			description: 'A rarity, as described in Ironsworn: Delve.'
		}
	),
	(schema) => ({ ...schema, additionalProperties: true })
)
export type Rarity = Static<typeof Rarity>
export type TRarity = typeof Rarity
