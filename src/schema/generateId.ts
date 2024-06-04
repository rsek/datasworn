import type * as DataswornSource from '../pkg-core/DataswornSource.js'
import CONST from '../pkg-core/IdElements/CONST.js'
import type { Datasworn } from '../pkg-core/index.js'

type NodeLike = {
	type: string
	_id?: string
	contents?: Record<string, NodeLike>
	collections?: Record<string, NodeLike>
}


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
