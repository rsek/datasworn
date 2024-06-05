import type DataswornNode from '../pkg-core/DataswornNode.js'
import CONST from '../pkg-core/IdElements/CONST.js'
import type { Datasworn, DataswornSource } from '../pkg-core/index.js'

const IdKey = '_id' as const satisfies keyof DataswornNode.Any
const AssetAbilitiesKey = 'abilities' as const satisfies keyof Datasworn.Asset
const AssetAbilityMovesKey =
	'moves' as const satisfies keyof Datasworn.AssetAbility

type NodeLike = {
	[IdKey]?: string
	type: string
	[CONST.ContentsKey]?: Record<string, NodeLike>
	[CONST.CollectionsKey]?: Record<string, NodeLike>
}

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
	const rulesPackageId = rulesPackage[IdKey]
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

// 	node[IdKey] ||= idParts.join(CONST.Sep)

// }

function walkAndAssignIds(
	node: NodeLike,
	key: string | number,
	parentId: string
) {
	node[IdKey] ||= createId(node, key, parentId)

	if (CONST.ContentsKey in node) {
		for (const key in node.contents) {
			const childNode = node.contents[key]
			walkAndAssignIds(childNode, key, node[IdKey])
		}
	}
	if (CONST.CollectionsKey in node) {
		for (const key in node.collections) {
			const childNode = node.collections[key]
			walkAndAssignIds(childNode, key, node[IdKey])
		}
	}

	// extra stuff for asset abilities

	if (node.type === 'asset') {
		const asset = node as Datasworn.Asset
		asset[AssetAbilitiesKey].forEach((assetAbility, i) => {
			assignAssetAbilityIds(assetAbility, i, asset[IdKey])
		})
	}
}

function assignAssetAbilityIds(
	assetAbility: DataswornSource.AssetAbility,
	index: number,
	parentId: string
) {
	assetAbility[IdKey] ||= [parentId, AssetAbilitiesKey, index].join(CONST.Sep)

	if (AssetAbilityMovesKey in assetAbility)
		for (const moveKey in assetAbility[AssetAbilityMovesKey]) {
			const move = assetAbility[AssetAbilityMovesKey][moveKey]
			move[IdKey] ||= [assetAbility[IdKey], AssetAbilityMovesKey, moveKey].join(
				CONST.Sep
			)
		}
}

function createId(node: NodeLike, key: string | number, parentId: string) {
	const [pkgId, _parentType, ...parentPath] = parentId.split(CONST.Sep)
	const idParts = [pkgId, node.type, ...parentPath, key]
	return idParts.join(CONST.Sep)
}
