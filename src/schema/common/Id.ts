import {
	type TUnion,
	type Static,
	type TRef,
	type TString,
	Type
} from '@sinclair/typebox'
import { type Opaque } from 'type-fest'
import {
	CollectionId,
	DiceRange,
	PropertyOf as Extend,
	Id,
	type IdElement,
	IdUnion,
	Index,
	Node,
	Pkg,
	RecursiveCollectableId,
	RecursiveCollectionId,
	NonCollectableId,
	toWildcardId,
	CollectableId,
	PropertyElement
} from '../utils/regex.js'
import { RecursiveCollectable } from '../index.js'
import { JsonTypeDef } from '../Symbols.js'
import JtdType from '../../scripts/json-typedef/typedef.js'

export const RulesetId = Id([Pkg], {
	$id: 'RulesetId',
	examples: ['classic', 'starforged', 'sundered_isles'],
	description:
		'The ID of standalone Datasworn package that describes its own ruleset.'
})
export type RulesetId = Static<typeof RulesetId>

export const ExpansionId = Id([Pkg], {
	$id: 'ExpansionId',
	examples: ['delve'],
	description:
		'The ID of a Datasworn package that relies on an external package to provide its ruleset.'
})
export type ExpansionId = Static<typeof ExpansionId>

export const DictKey = Id([Node], {
	$id: 'DictKey',
	description: 'A `snake_case` key used in a Datasworn dictionary object.',
	remarks:
		"If you need to generate a key from a user-provided label, it's recommended to use a 'slugify' function/library, e.g. https://www.npmjs.com/package/slugify for NodeJS."
})
export type DictKey = Static<typeof DictKey>

export const NpcCollectionId = CollectionId('npc_collection', {
	$id: 'NpcCollectionId',
	examples: [
		'classic/npc_collection/firstborn',
		'starforged/npc_collection/sample_npcs'
	]
})

export type NpcCollectionId = Opaque<Static<typeof NpcCollectionId>>

export const NpcCollectionIdWildcard = toWildcardId(NpcCollectionId, {
	$id: 'NpcCollectionIdWildcard'
})
export type NpcCollectionIdWildcard = Static<typeof NpcCollectionIdWildcard>

export const NpcId = RecursiveCollectableId('npc', {
	$id: 'NpcId',
	examples: ['classic/npc/firstborn/elf', 'starforged/npc/sample_npcs/chiton']
})

export type NpcId = Opaque<Static<typeof NpcId>>

export const NpcIdWildcard = toWildcardId(NpcId, {
	$id: 'NpcIdWildcard'
})
export type NpcIdWildcard = Opaque<Static<typeof NpcIdWildcard>>

export const NpcVariantId = Extend(NpcId, ['variants', Node], {
	$id: 'NpcVariantId',
	examples: ['starforged/npc/sample_npcs/chiton.variants/chiton_drone_pack']
})

export type NpcVariantId = Opaque<Static<typeof NpcVariantId>>

export const AssetCollectionId = CollectionId('asset_collection', {
	$id: 'AssetCollectionId'
})
export type AssetCollectionId = Opaque<Static<typeof AssetCollectionId>>

export const AssetCollectionIdWildcard = toWildcardId(AssetCollectionId, {
	$id: 'AssetCollectionIdWildcard'
})
export type AssetCollectionIdWildcard = Static<typeof AssetCollectionIdWildcard>

export const AssetId = CollectableId('asset', {
	$id: 'AssetId'
})
export type AssetId = Opaque<Static<typeof AssetId>>

export const AssetIdWildcard = toWildcardId(AssetId, {
	$id: 'AssetIdWildcard'
})
export type AssetIdWildcard = Opaque<Static<typeof AssetIdWildcard>>

export const AssetAbilityId = Extend(
	AssetId,
	[new PropertyElement('abilities'), Index],
	{
		$id: 'AssetAbilityId'
	}
)
export type AssetAbilityId = Opaque<Static<typeof AssetAbilityId>>

export const DelveSiteId = NonCollectableId('delve_site', {
	examples: ['delve/delve_site/alvas_rest'],
	$id: 'DelveSiteId'
})
export type DelveSiteId = Opaque<Static<typeof DelveSiteId>>

export const DelveSiteIdWildcard = toWildcardId(DelveSiteId, {
	$id: 'DelveSiteIdWildcard'
})
export type DelveSiteIdWildcard = Static<typeof DelveSiteIdWildcard>

export const DelveSiteThemeId = NonCollectableId('delve_site_theme', {
	$id: 'DelveSiteThemeId',
	examples: ['delve/delve_site_theme/hallowed']
})
export type DelveSiteThemeId = Opaque<Static<typeof DelveSiteThemeId>>

export const DelveSiteThemeIdWildcard = toWildcardId(DelveSiteThemeId, {
	$id: 'DelveSiteThemeIdWildcard'
})
export type DelveSiteThemeIdWildcard = Static<typeof DelveSiteThemeIdWildcard>

export const DelveSiteDomainId = NonCollectableId('delve_site_domain', {
	$id: 'DelveSiteDomainId',
	examples: ['delve/delve_site_domain/shadowfen']
})
export type DelveSiteDomainId = Opaque<Static<typeof DelveSiteDomainId>>

export const DelveSiteDomainIdWildcard = toWildcardId(DelveSiteDomainId, {
	$id: 'DelveSiteDomainIdWildcard'
})
export type DelveSiteDomainIdWildcard = Static<typeof DelveSiteDomainIdWildcard>

// export const DomainFeatureRowId = Extend(
// 	DelveSiteDomainId,
// 	['features', DiceRange],
// 	{
// 		$id: 'DomainFeatureRowId'
// 	}
// )
// export type DomainFeatureRowId = Opaque<Static<typeof DomainFeatureRowId>>

// export const DomainDangerRowId = Extend(
// 	DelveSiteDomainId,
// 	['dangers', DiceRange],
// 	{
// 		$id: 'DomainDangerRowId'
// 	}
// )
// export type DomainDangerRowId = Opaque<Static<typeof DomainDangerRowId>>

export const MoveCategoryId = CollectionId('move_category', {
	examples: ['starforged/move_category/adventure'],
	$id: 'MoveCategoryId'
})
export type MoveCategoryId = Opaque<Static<typeof MoveCategoryId>>

export const MoveCategoryIdWildcard = toWildcardId(MoveCategoryId, {
	$id: 'MoveCategoryIdWildcard'
})
export type MoveCategoryIdWildcard = Static<typeof MoveCategoryIdWildcard>

const StandardMoveId = CollectableId('move', {
	description: 'A move ID for a standard move.',
	$id: 'StandardMoveId',
	title: 'StandardMoveId'
})
const AssetMoveId = Type.String({
	$id: 'AssetMoveId',
	title: 'AssetMoveId',
	pattern:
		'^([a-z][a-z0-9_]{3,})\\/asset\\/([a-z][a-z_]*)\\/([a-z][a-z_]*)\\.abilities\\/(\\d+)\\.moves\\/([a-z][a-z_]*)$',
	description: 'A move ID for an asset move.'
})
export const MoveId = Type.Union([StandardMoveId, AssetMoveId], {
	description: 'A move ID, for a standard move or a unique asset move',
	examples: [
		'classic/move/combat/strike',
		'starforged/asset/module/grappler.abilities/0.moves/ready_grappler'
	],
	$id: 'MoveId',
	[JsonTypeDef]: {
		schema: JtdType.String({
			pattern: StandardMoveId.pattern + '|' + AssetMoveId.pattern
		})
	}
})
export type MoveId = Opaque<Static<typeof MoveId>>

const StandardMoveIdWildcard = toWildcardId(StandardMoveId)

const AssetMoveIdWildcard = Type.String({
	$id: 'AssetMoveIdWildcard',
	title: 'AssetMoveIdWildcard',
	pattern:
		'^(\\*|[a-z][a-z0-9_]{3,})\\/asset\\/(\\*|[a-z][a-z_]*)\\/(\\*|[a-z][a-z_]*)\\.abilities\\/(\\*|\\d+)\\.moves\\/(\\*|[a-z][a-z_]*)$',
	description: 'A move ID for an asset move.'
})
export const MoveIdWildcard = Type.Union(
	[StandardMoveIdWildcard, AssetMoveIdWildcard],
	{
		title: 'Move ID (with wildcard)',
		description: 'A move ID with wildcards.',
		examples: ['*/move/*/face_danger', '*/asset/ritual/*.abilities/*.moves/*'],
		$id: 'MoveIdWildcard',
		[JsonTypeDef]: {
			schema: JtdType.String({
				pattern:
					StandardMoveIdWildcard.pattern + '|' + AssetMoveIdWildcard.pattern
			})
		}
	}
)
export type MoveIdWildcard = Opaque<Static<typeof MoveIdWildcard>>

export const OracleCollectionId = RecursiveCollectionId('oracle_collection', {
	examples: [
		'starforged/oracle_collection/core',
		'starforged/oracle_collection/character/names',
		'starforged/oracle_collection/planets/furnace/settlements'
	],
	$id: 'OracleCollectionId'
})
export type OracleCollectionId = Opaque<Static<typeof OracleCollectionId>>

export const OracleCollectionIdWildcard = toWildcardId(OracleCollectionId, {
	$id: 'OracleCollectionIdWildcard'
})
export type OracleCollectionIdWildcard = Static<
	typeof OracleCollectionIdWildcard
>

export const OracleRollableId = RecursiveCollectableId('oracle_rollable', {
	title: 'OracleRollableId',
	examples: [
		'starforged/oracle_rollable/core/action',
		'starforged/oracle_rollable/character/names/given',
		'starforged/oracle_rollable/planets/furnace/settlements/terminus'
	],
	$id: 'OracleRollableId'
})
export type OracleRollableId = Opaque<Static<typeof OracleRollableId>>

export const OracleRollableIdWildcard = toWildcardId(OracleRollableId, {
	description: `Oracle table wildcards can also use '**' to represent any number of collection levels in the oracle tree.`,
	// For example, 'starforged/oracle_rollable/\*\*/location' represents any starforged table with the "location" key.`,
	// the double asterisk messes with JTD here :thinking:
	examples: [
		'*/oracle_rollable/**/peril',
		'starforged/oracle_rollable/character/names/*',
		'starforged/oracle_rollable/planets/*/settlements/*'
	],
	$id: 'OracleRollableIdWildcard'
})
export type OracleRollableIdWildcard = Opaque<
	Static<typeof OracleRollableIdWildcard>
>

export const RarityId = NonCollectableId('rarity', {
	examples: ['classic/rarities/ayethins_journal'],
	$id: 'RarityId'
})
export type RarityId = Opaque<Static<typeof RarityId>>

export const RarityIdWildcard = toWildcardId(RarityId, {
	$id: 'RarityIdWildcard'
})
export type RarityIdWildcard = Static<typeof RarityIdWildcard>

export const AtlasCollectionId = CollectionId('atlas_entry', {
	examples: ['classic/atlas_collection/ironlands'],
	$id: 'AtlasCollectionId'
})
export type AtlasCollectionId = Opaque<Static<typeof AtlasCollectionId>>

export const AtlasCollectionIdWildcard = toWildcardId(AtlasCollectionId, {
	$id: 'AtlasCollectionIdWildcard'
})
export type AtlasCollectionIdWildcard = Static<typeof AtlasCollectionIdWildcard>

export const AtlasEntryId = RecursiveCollectableId('atlas_entry', {
	examples: ['classic/atlas_entry/ironlands/hinterlands'],
	$id: 'AtlasEntryId'
})
export type AtlasEntryId = Opaque<Static<typeof AtlasEntryId>>

export const AtlasEntryIdWildcard = toWildcardId(AtlasEntryId, {
	$id: 'AtlasEntryIdWildcard'
})
export type AtlasEntryIdWildcard = Opaque<Static<typeof AtlasEntryIdWildcard>>

export const TruthId = NonCollectableId('truth', {
	examples: ['classic/truth/iron', 'starforged/truth/iron'],
	$id: 'TruthId'
})
export type TruthId = Opaque<Static<typeof TruthId>>

export const TruthIdWildcard = toWildcardId(TruthId, {
	$id: 'TruthIdWildcard'
})
export type TruthIdWildcard = Static<typeof TruthIdWildcard>


// const RuleIdHead: IdElement[] = [Pkg, 'rules']

// export const StatRuleId = Id([...RuleIdHead, 'stats', Node], {
// 	$id: 'StatRuleId'
// })
// export type StatRuleId = Static<typeof StatRuleId>

// export const ConditionMeterRuleId = Id([...RuleIdHead, 'condition_meters', Node], {
// 	$id: 'ConditionMeterRuleId',
// 	examples: [
// 		'classic/rules/condition_meters/health',
// 		'starforged/rules/condition_meters/spirit'
// 	]
// })
// export type ConditionMeterRuleId = Static<typeof ConditionMeterRuleId>

// export const SpecialTrackRuleId = Id([...RuleIdHead, 'special_tracks', Node], {
// 	$id: 'SpecialTrackRuleId',
// 	examples: [
// 		'classic/rules/special_tracks/bonds',
// 		'delve/rules/special_tracks/failure',
// 		'starforged/rules/special_tracks/bonds_legacy'
// 	]
// })
// export type SpecialTrackRuleId = Static<typeof SpecialTrackRuleId>

// export const ImpactRuleCollectionId = CollectionId('rules' 'impacts'], {
// 	$id: 'ImpactRuleCollectionId',
// 	examples: [
// 		'classic/collections/rules/impacts/conditions',
// 		'starforged/collections/rules/impacts/vehicle_troubles'
// 	]
// })
// export type ImpactRuleCollectionId = Static<typeof ImpactRuleCollectionId>

// export const ImpactRuleId = Extend(ImpactRuleCollectionId, [Node], {
// 	$id: 'ImpactRuleId',
// 	examples: [
// 		'classic/rules/impacts/conditions/wounded',
// 		'starforged/rules/impacts/vehicle_troubles/battered'
// 	]
// })
// export type ImpactRuleId = Static<typeof ImpactRuleId>

export type TAnyId = TRef<TString | TUnion<(TString | TRef<TString>)[]>>
