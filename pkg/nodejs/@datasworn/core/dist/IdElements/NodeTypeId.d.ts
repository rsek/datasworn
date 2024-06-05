/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
declare namespace NodeTypeId {
    namespace Collectable {
        const Recursive: readonly ["atlas_entry", "npc", "oracle_rollable"];
        /** Object types that can exist in recursive collections. */
        type Recursive = (typeof Recursive)[number];
        const NonRecursive: readonly ["asset", "move"];
        /** ID type elements for types that can exist in non-recursive collections. */
        type NonRecursive = (typeof NonRecursive)[number];
        /** Union of ID type elements for types that can exist in recursive or non-recursive collections. */
        type Any = Recursive | NonRecursive;
    }
    namespace Collection {
        const Recursive: readonly ["atlas_collection", "npc_collection", "oracle_collection"];
        type Recursive = (typeof Recursive)[number];
        const NonRecursive: readonly ["asset_collection", "move_category"];
        type NonRecursive = (typeof NonRecursive)[number];
        type Any = Recursive | NonRecursive;
    }
    /** ID type elements for types that don't use collections at all. */
    const NonCollectable: readonly ["delve_site", "delve_site_domain", "delve_site_theme", "rarity", "truth"];
    type NonCollectable = (typeof NonCollectable)[number];
    type Any = Collectable.Any | Collection.Any | NonCollectable;
    const CollectedByMap: {
        readonly asset_collection: "asset";
        readonly move_category: "move";
        readonly atlas_collection: "atlas_entry";
        readonly npc_collection: "npc";
        readonly oracle_collection: "oracle_rollable";
    };
    type CollectableOf<T extends Collection.Any> = (typeof CollectedByMap)[T];
    function getCollectableOf<T extends Collection.Any>(typeId: T): CollectableOf<T>;
    const CollectionOfMap: {
        readonly asset: "asset_collection";
        readonly move: "move_category";
        readonly atlas_entry: "atlas_collection";
        readonly npc: "npc_collection";
        readonly oracle_rollable: "oracle_collection";
    };
    type CollectionOf<T extends Collectable.Any> = (typeof CollectionOfMap)[T];
    function getCollectionOf<T extends Collectable.Any>(typeId: T): CollectionOf<T>;
    const RootKeys: {
        readonly asset_collection: "assets";
        readonly asset: "assets";
        readonly move_category: "moves";
        readonly move: "moves";
        readonly atlas_collection: "atlas";
        readonly atlas_entry: "atlas";
        readonly npc_collection: "npcs";
        readonly npc: "npcs";
        readonly oracle_collection: "oracles";
        readonly oracle_rollable: "oracles";
        readonly delve_site: "delve_sites";
        readonly truth: "truths";
        readonly delve_site_domain: "site_domains";
        readonly delve_site_theme: "site_themes";
        readonly rarity: "rarities";
    };
    type RootKey<T extends Any = Any> = (typeof RootKeys)[T];
    function getRootKey<T extends Any>(typeId: T): RootKey<T>;
}
export default NodeTypeId;
