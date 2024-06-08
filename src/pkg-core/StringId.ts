import type { DictKey, ExpansionId, RulesetId } from './Datasworn.js'
import { type CONST, type NodeTypeId } from './IdElements/index.js'
import {
	type CollectionPathKeys,
	type CollectionAncestorKeys
} from './IdElements/PathKeys.js'
import { type Join } from './Utils/String.js'

export type RulesPackageId = RulesetId | ExpansionId

export type Id<
	RulesPackage extends RulesPackageId,
	TypeKey extends NodeTypeId.AnyPrimary,
	PathKeys extends DictKey[]
> = Join<[RulesPackage, TypeKey, ...PathKeys], CONST.PathSep>

export type RecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		NodeTypeId.Collectable.Recursive = NodeTypeId.Collectable.Recursive,
	AncestorKeys extends CollectionPathKeys = CollectionPathKeys,
	Key extends string = string
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>
type _AtlasEntryId = RecursiveCollectableId<string, 'atlas_entry', ['ff'], 'f'>

export type CollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends NodeTypeId.Collectable.Any = NodeTypeId.Collectable.Any,
	AncestorKeys extends DictKey[] = DictKey[],
	Key extends DictKey = DictKey
> = Id<RulesPackage, Type, [...AncestorKeys, Key]>

export type NonRecursiveCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		NodeTypeId.Collectable.NonRecursive = NodeTypeId.Collectable.NonRecursive,
	ParentKey extends DictKey = DictKey,
	Key extends DictKey = DictKey
> = CollectableId<RulesPackage, Type, [ParentKey], Key>
type _AssetId = NonRecursiveCollectableId<string, 'asset', 'a', 'b'>

export type CollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends NodeTypeId.Collection.Any = NodeTypeId.Collection.Any,
	CollectionPathKeys extends string[] = string[],
	Key extends string = string
> = Id<RulesPackage, Type, [...CollectionPathKeys, Key]>

export type RecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		NodeTypeId.Collection.Recursive = NodeTypeId.Collection.Recursive,
	CollectionPathKeys extends CollectionAncestorKeys = CollectionAncestorKeys,
	Key extends string = string
> = CollectionId<RulesPackage, Type, CollectionPathKeys, Key>

type _AtlasCollectionId = RecursiveCollectionId<
	string,
	'atlas_collection',
	[],
	'f'
>

export type NonRecursiveCollectionId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends
		NodeTypeId.Collection.NonRecursive = NodeTypeId.Collection.NonRecursive,
	Key extends DictKey = DictKey
> = CollectionId<RulesPackage, Type, [], Key>

type _AssetCollectionId = NonRecursiveCollectionId<
	string,
	'asset_collection',
	'path'
>

export type NonCollectableId<
	RulesPackage extends RulesPackageId = RulesPackageId,
	Type extends NodeTypeId.NonCollectable = NodeTypeId.NonCollectable,
	Key extends DictKey = DictKey
> = Id<RulesPackage, Type, [Key]>

type _TruthId = NonCollectableId<'fff', 'truth', 'f'>

export type AnyCollectableId =
	| RecursiveCollectableId
	| NonRecursiveCollectableId

export type AnyCollectionId = RecursiveCollectionId | NonRecursiveCollectionId

export type AnyId = AnyCollectableId | AnyCollectionId | NonCollectableId
