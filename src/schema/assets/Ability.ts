import { Type, type Static } from '@sinclair/typebox'
import * as Generic from '../Generic.js'
import { EmbeddedMove } from '../moves/EmbeddedMove.js'
import { MoveEnhancement } from '../moves/MoveEnhancement.js'
import type { Tags } from '../Rules.js'
import { AssetEnhancement } from './Enhancement.js'
import { AssetAbilityControlField, AssetAbilityOptionField } from './Fields.js'
import { EmbeddedOracleRollable } from '../oracles/EmbeddedOracleRollable.js'

import Id from '../common/Id.js'
import * as Text from '../common/Text.js'

export const AssetAbility = Generic.IdNode(
	Type.Object({
		name: Type.Optional(
			Type.Ref(Text.Label, {
				description:
					'A handful of asset abilities have a label/name, for instance classic Ironsworn companion assets. Most canonical assets omit this property.'
			})
		),
		text: Type.Ref(Text.MarkdownString, {
			description: 'The complete rules text of this asset ability.'
		}),
		enabled: Type.Boolean({
			default: false,
			description: 'Is this asset ability enabled?'
		}),
		moves: Type.Optional(
			Generic.Dictionary(
				Type.Ref(EmbeddedMove, { title: 'AssetAbilityMove' }),
				{
					title: 'AssetAbilityMoves',
					description: 'Unique moves added by this asset ability.'
				}
			)
		),
		oracles: Type.Optional(
			Generic.Dictionary(
				Type.Ref(EmbeddedOracleRollable, {
					title: 'AssetAbilityOracleRollable'
				}),
				{
					title: 'AssetAbilityOracles'
				}
			)
		),
		options: Type.Optional(
			Generic.Dictionary(Type.Ref(AssetAbilityOptionField), {
				description:
					'Fields that are expected to be set once and remain the same through the life of the asset.'
			})
		),
		controls: Type.Optional(
			Generic.Dictionary(Type.Ref(AssetAbilityControlField), {
				description:
					'Fields whose values are expected to change over the life of the asset.'
			})
		),
		enhance_asset: Type.Optional(
			Type.Ref(AssetEnhancement, {
				description: 'Changes made to the asset, when this ability is enabled.'
			})
		),
		enhance_moves: Type.Optional(
			Type.Array(Type.Ref(MoveEnhancement), {
				description:
					'Describes changes made to various moves by this asset ability. Usually these require specific trigger conditions.'
				// releaseStage: 'experimental'
			})
		),
		tags: Type.Optional(Type.Ref('Tags'))
	}),
	Type.Ref(Id.AssetAbilityId),
	{
		$id: 'AssetAbility',
		description:
			'An asset ability: one of the purchasable features of an asset. Most assets have three.'
	}
)
export type AssetAbility = Static<typeof AssetAbility>
export type TAssetAbility = typeof AssetAbility
