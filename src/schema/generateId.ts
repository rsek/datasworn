import type * as DataswornSource from '../pkg-core/DataswornSource.js'
import CONST from '../pkg-core/IdElements/CONST.js'
import type { Datasworn } from '../pkg-core/index.js'

type NodeLike = {
	type: string
	_id?: string
	contents?: Record<string, NodeLike>
	collections?: Record<string, NodeLike>
}

// 'starforged/oracle/core/action'

// '.' as "next element is a literal property" character, e.g.
// asset ability move ID? 'starforged/asset/ritual/commune.abilities/0.moves/commune'
// NPC variant ID? 'starforged/npc/sth/some_guy.variants/a_larger_guy'
//

const typeRootKeys = [
	'oracles',
	'moves',
	'assets',
	'atlas',
	'npcs',
	'truths',
	'rarities'
] satisfies (keyof DataswornSource.Expansion)[]

const metadataKeys = [
	'datasworn_version',
	'description',
	'_id',
	'authors',
	'date',
	'description',
	'license',
	'ruleset',
	'rules',
	'title',
	'type',
	'url'
] as const satisfies (keyof DataswornSource.Expansion)[]
type MetadataKey = (typeof metadataKeys)[number]
type TypeRootKey = Exclude<keyof DataswornSource.Expansion, MetadataKey>
type TypeRoot = Exclude<DataswornSource.Expansion[TypeRootKey], undefined>
type TypeTrunk = TypeRoot[keyof TypeRoot]

export function assignIds(rulesPackage: DataswornSource.RulesPackage) {
	const rulesPackageId = rulesPackage._id
	for (const k in rulesPackage) {
		// @ts-expect-error
		if (metadataKeys.includes(k)) continue
		const typeRoot = rulesPackage[k as TypeRootKey] satisfies
			| Record<string, NodeLike>
			| undefined
		if (typeRoot == null) continue
		for (const dictKey in typeRoot) {
			walkAndAssignIds(typeRoot[dictKey], dictKey, rulesPackageId)
		}
	}
}

// function assignTrunkId(
// 	node: TypeTrunk,
// 	dictKey: string,
// 	rulesPackageId: string
// ) {
// 	const idParts: string[] = [rulesPackageId, node.type, dictKey]

// 	node._id ||= idParts.join(CONST.Sep)

// }

function walkAndAssignIds(
	node: NodeLike,
	key: string | number,
	parentId: string
) {
	node._id ||= createId(node, key, parentId)

	if ('contents' in node) {
		for (const key in node.contents) {
			const childNode = node.contents[key]
			walkAndAssignIds(childNode, key, node._id)
		}
	}
	if ('collections' in node) {
		for (const key in node.collections) {
			const childNode = node.collections[key]
			walkAndAssignIds(childNode, key, node._id)
		}
	}

	// extra stuff for specific types

	if (node.type === 'asset') {
		const asset = node as Datasworn.Asset
		asset.abilities.forEach((assetAbility, i) => {
			assignAssetAbilityIds(assetAbility, i, asset._id)
		})
	}

	if (node.type === 'npc') assignNpcVariantIds(node as Datasworn.Npc)
}

// TODO: npc variant IDs should probably be deprecated, TBH
function assignNpcVariantIds(npc: Datasworn.Npc) {
	if ('variants' in npc) {
		for (const k in npc.variants) {
			const npcVariant = npc.variants[k] as DataswornSource.NpcVariant
			npcVariant._id ||= [npc._id, CONST.Sep, 'variants', CONST.Sep, k].join('')
		}
	}
}

function assignAssetAbilityIds(
	assetAbility: DataswornSource.AssetAbility,
	index: number,
	parentId: string
) {
	assetAbility._id ||= [
		parentId,
		CONST.Sep,
		'abilities',
		CONST.Sep,
		index
	].join('')

	if ('moves' in assetAbility)
		for (const moveKey in assetAbility.moves) {
			const move = assetAbility.moves[moveKey]
			move._id ||= [
				assetAbility._id,
				CONST.Sep,
				'moves',
				CONST.Sep,
				moveKey
			].join('')
		}
}

function createId(node: NodeLike, key: string | number, parentId: string) {
	const [pkgId, _parentType, ...parentPath] = parentId.split(CONST.Sep)
	const idParts = [pkgId, node.type, ...parentPath, key]
	return idParts.join(CONST.Sep)
}
