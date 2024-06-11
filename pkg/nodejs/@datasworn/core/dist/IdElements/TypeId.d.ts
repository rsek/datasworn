/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
declare namespace TypeId {
    /** Object types that can exist in collections. */
    const Collectable: readonly ["atlas_entry", "npc", "oracle_rollable", "asset", "move"];
    type Collectable = (typeof Collectable)[number];
    const Collection: readonly ["atlas_collection", "npc_collection", "oracle_collection", "asset_collection", "move_category"];
    type Collection = (typeof Collection)[number];
    /** ID type elements for types that don't use collections at all. */
    const NonCollectable: readonly ["delve_site", "delve_site_domain", "delve_site_theme", "rarity", "truth"];
    type NonCollectable = (typeof NonCollectable)[number];
    /** Any primary node type. Primary node types can have IDs that address only their type (IDs without '.' separators). */
    type AnyPrimary = Collectable | Collection | NonCollectable;
    const CollectedByMap: {
        readonly asset_collection: "asset";
        readonly move_category: "move";
        readonly atlas_collection: "atlas_entry";
        readonly npc_collection: "npc";
        readonly oracle_collection: "oracle_rollable";
    };
    type CollectableOf<T extends Collection> = (typeof CollectedByMap)[T];
    function getCollectableOf<T extends Collection>(typeId: T): CollectableOf<T>;
    const CollectionOfMap: {
        readonly asset: "asset_collection";
        readonly move: "move_category";
        readonly atlas_entry: "atlas_collection";
        readonly npc: "npc_collection";
        readonly oracle_rollable: "oracle_collection";
    };
    type CollectionOf<T extends Collectable> = (typeof CollectionOfMap)[T];
    function getCollectionOf<T extends Collectable>(typeId: T): CollectionOf<T>;
    const EmbeddablePrimaryTypes: ["oracle_rollable", "move"];
    type EmbeddablePrimaryTypes = (typeof EmbeddablePrimaryTypes)[number];
    const EmbedOnlyTypes: readonly ["ability", "option"];
    type EmbedOnlyTypes = (typeof EmbedOnlyTypes)[number];
    const EmbeddableTypes: ["oracle_rollable", "move", "ability", "option"];
    type EmbeddableTypes = (typeof EmbeddableTypes)[number];
    const EmbeddedTypePaths: ["asset.ability", "truth.option", "move.oracle_rollable"];
    type EmbeddedTypePaths = (typeof EmbeddedTypePaths)[number];
    const EmbedOfEmbedTypePaths: ["asset.ability.move", "asset.ability.oracle_rollable", "truth.option.oracle_rollable"];
    type EmbedOfEmbedTypePaths = (typeof EmbedOfEmbedTypePaths)[number];
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
    const EmbeddedPropertyKeys: {
        readonly ability: "abilities";
        readonly option: "options";
    };
    type Any = AnyPrimary | EmbeddedTypePaths | EmbedOfEmbedTypePaths;
    type RootKey<T extends AnyPrimary = AnyPrimary> = (typeof RootKeys)[T];
    type EmbeddedPropertyKey<T extends EmbeddableTypes> = T extends keyof typeof EmbeddedPropertyKeys ? (typeof EmbeddedPropertyKeys)[T] : T extends AnyPrimary ? RootKey<T> : never;
    function getRootKey<T extends AnyPrimary>(typeId: T): RootKey<T>;
    function getEmbeddedPropertyKey<T extends EmbeddableTypes>(typeId: T): EmbeddedPropertyKey<T>;
    function getEmbeddableTypes<T extends Any>(typeId: T): ("oracle_rollable" | "move" | "ability" | "option")[];
}
export default TypeId;
