import type * as Datasworn from './Datasworn.js'
import type NodeTypeId from './IdElements/NodeTypeId.js'

namespace DataswornNode {
	export namespace Collectable {
		export type NonRecursive = ByType<NodeTypeId.Collectable.NonRecursive>
		export type Recursive = ByType<NodeTypeId.Collectable.Recursive>
		export type Any = NonRecursive | Recursive
	}
	export type NonCollectable = ByType<NodeTypeId.NonCollectable>
	export namespace Collection {
		export type NonRecursive = ByType<NodeTypeId.Collection.NonRecursive>
		export type Recursive = ByType<NodeTypeId.Collection.Recursive>
		export type Any = NonRecursive | Recursive
	}

	type TypeMap = {
		[k in NodeTypeId.Any]: Extract<DataswornNode.Any, { type: k }>
	}

	/** Gets the node object type corresponding to a given TypeId. */
	export type ByType<T extends NodeTypeId.Any = NodeTypeId.Any> = TypeMap[T]

	/** A union of all Datasworn node types. */
	export type Any =
		| Datasworn.AssetCollection
		| Datasworn.Asset
		| Datasworn.MoveCategory
		| Datasworn.Move
		| Datasworn.AtlasCollection
		| Datasworn.AtlasEntry
		| Datasworn.NpcCollection
		| Datasworn.Npc
		| Datasworn.OracleCollection
		| Datasworn.OracleRollable
		| Datasworn.DelveSite
		| Datasworn.Truth
		| Datasworn.DelveSiteDomain
		| Datasworn.DelveSiteTheme
		| Datasworn.Rarity
}

export default DataswornNode
