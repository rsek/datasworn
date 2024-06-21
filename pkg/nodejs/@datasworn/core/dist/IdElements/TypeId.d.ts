/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * On major nodes, TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
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
    type Primary = Collectable | Collection | NonCollectable;
    const Primary: ["atlas_entry", "npc", "oracle_rollable", "asset", "move", "atlas_collection", "npc_collection", "oracle_collection", "asset_collection", "move_category", "delve_site", "delve_site_domain", "delve_site_theme", "rarity", "truth"];
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
    const EmbeddablePrimary: ["oracle_rollable", "move"];
    type EmbeddablePrimary = (typeof EmbeddablePrimary)[number];
    const EmbedOnly: readonly ["ability", "option", "row", "feature", "danger", "denizen", "variant"];
    type EmbedOnly = (typeof EmbedOnly)[number];
    const Embeddable: ["oracle_rollable", "move", "ability", "option", "row", "feature", "danger", "denizen", "variant"];
    type Embeddable = EmbeddablePrimary | EmbedOnly;
    const EmbedTypeMap: {
        readonly asset: ["ability"];
        readonly ability: ["move", "oracle_rollable"];
        readonly truth: ["option"];
        readonly option: ["oracle_rollable"];
        readonly move: ["oracle_rollable"];
        readonly oracle_rollable: ["row"];
        readonly delve_site: ["denizen"];
        readonly delve_site_domain: ["feature", "danger"];
        readonly delve_site_theme: ["feature", "danger"];
        readonly npc: ["variant"];
    };
    type Embedding = keyof typeof EmbedTypeMap;
    type EmbeddableIn<T extends Embedding> = (typeof EmbedTypeMap)[T][number];
    /** Types that can be an embed of an embed. */
    const EmbeddableInEmbeddedTypeMap: {
        readonly ability: ["oracle_rollable", "move"];
        readonly move: [];
        readonly option: ["oracle_rollable"];
        readonly oracle_rollable: ["row"];
    };
    type EmbeddingWhenEmbeddedType = keyof typeof EmbeddableInEmbeddedTypeMap;
    type EmbeddableInEmbeddedType<T extends EmbeddingWhenEmbeddedType = EmbeddingWhenEmbeddedType> = (typeof EmbeddableInEmbeddedTypeMap)[T][number];
    function canHaveEmbed(typeId: string, typeIsEmbedded?: boolean): boolean;
    function canBeEmbedded(typeId: string): boolean;
    function isPrimary(typeId: string): typeId is Primary;
    function isEmbedOnly(typeId: string): typeId is EmbedOnly;
    function getEmbeddableTypes(embeddingType: Any, typeIsEmbedded?: boolean): Embeddable[];
    function getTypesThatCanHaveEmbedOfType(typeId: string): Embedding[];
    type CanEmbedType<T extends Embeddable = Embeddable> = {
        [P in keyof typeof EmbedTypeMap as (typeof EmbedTypeMap)[P][number]]: P;
    }[T];
    const EmbeddedTypePath: string[];
    const EmbeddedPropertyKeys: {
        readonly ability: "abilities";
        readonly option: "options";
        readonly row: "rows";
        readonly feature: "features";
        readonly danger: "dangers";
        readonly denizen: "denizens";
        readonly variant: "variants";
    };
    function getEmbeddedPropertyType(typeId: TypeId.Any): 'array' | 'dictionary';
    type Any = Primary | EmbedOnly;
    const Any: ["atlas_entry", "npc", "oracle_rollable", "asset", "move", "atlas_collection", "npc_collection", "oracle_collection", "asset_collection", "move_category", "delve_site", "delve_site_domain", "delve_site_theme", "rarity", "truth", "ability", "option", "row", "feature", "danger", "denizen", "variant"];
    /** The ancestor key of this type on the {@link Datasworn.RulesPackage} object. */
    const BranchKey: {
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
    type BranchKey<T extends Primary = Primary> = (typeof BranchKey)[T];
    /** The ancestor key of this type when it's embedded in another object. */
    type EmbeddedPropertyKey<T extends Embeddable> = T extends keyof typeof EmbeddedPropertyKeys ? (typeof EmbeddedPropertyKeys)[T] : T extends Primary ? BranchKey<T> : never;
    function getBranchKey<T extends Primary>(typeId: T): BranchKey<T>;
    function getEmbeddedPropertyKey<T extends Embeddable>(typeId: T): EmbeddedPropertyKey<T>;
}
export default TypeId;
