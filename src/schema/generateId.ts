import type { Expansion } from '../pkg-core/Datasworn.js'
import type { RulesPackage } from '../pkg-core/DataswornSource.js'
import CONST from '../pkg-core/IdElements/CONST.js'

type NodeLike = { type: string; _id?: string }

function createId(node: NodeLike, key: string | number, parentId: string) {
	const [pkgId, parentType, ...parentPath] = parentId.split(CONST.Sep)
}

const typeRootKeys = [
	'oracles',
	'moves',
	'assets',
	'atlas',
	'npcs',
	'truths',
	'rarities'
] satisfies (keyof Expansion)[]

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
] as const satisfies (keyof Expansion)[]
type MetadataKey = (typeof metadataKeys)[number]
type TypeRootKey = Exclude<keyof Expansion, MetadataKey>

function assignIds(rulesPackage: RulesPackage) {
	const rulesPackageId = rulesPackage._id
	for (const k in rulesPackage) {
		// @ts-expect-error
		if (metadataKeys.includes(k)) continue
		const typeRoot = rulesPackage[k as TypeRootKey] satisfies
			| Record<string, NodeLike>
			| undefined
		if (typeRoot == null) continue
	}
}
