import { Type, type Static } from '@sinclair/typebox'
import { CollectableNode } from './generic/CollectableNode.js'
import { CollectionNode } from './generic/CollectionNode.js'
import { Dictionary } from './generic/Dictionary.js'
import { Label, MarkdownString } from './common/Text.js'
import { FlatIntersect } from './utils/FlatIntersect.js'

import { AssetPropertiesEnhanceable } from './assets/common.js'
import type { TAssetAbility } from './assets/Ability.js'
import type { TAssetControlField, TAssetOptionField } from './assets/Fields.js'

const AssetMixin = Type.Object({
	category: Type.Ref(Label, {
		description:
			"A localized category label for this asset. This is the surtitle above the asset's name on the card.",
		examples: [
			'Combat Talent',
			'Command Vehicle',
			'Companion',
			'Deed',
			'Module',
			'Path',
			'Ritual',
			'Support Vehicle'
		]
	}),
	options: Dictionary(Type.Ref('AssetOptionField'), {
		description:
			"Options are input fields set when the player purchases the asset. They're likely to remain the same through the life of the asset. Typically, they are rendered at the top of the asset card."
	}),
	requirement: Type.Optional(
		Type.Ref(MarkdownString, {
			description: 'Describes prerequisites for purchasing or using this asset.'
		})
	),
	abilities: Type.Array(
		Type.Ref('AssetAbility', {
			description: 'Abilities provided by this asset. Most assets have 3.'
		})
	)
})

export const Asset = CollectableNode(
	FlatIntersect([
		AssetMixin,
		AssetPropertiesEnhanceable(
			Type.Ref('AssetControlField')
		)
	]),
	'asset'
)

export type TAsset = typeof Asset
// export type Asset = Collectable<
// 	Static<typeof AssetMixin> &
// 		Static<ReturnType<typeof AssetPropertiesEnhanceable<TAssetControlField>>>
// >

export const AssetCollection = CollectionNode(
	Type.Object({}),
	'asset_collection',
	{
		$id: 'AssetCollection'
	}
)
export type TAssetCollection = typeof AssetCollection
// export type AssetCollection = Collection<Asset>

export * from './assets/Ability.js'
export * from './assets/Enhancement.js'
export * from './assets/Fields.js'
