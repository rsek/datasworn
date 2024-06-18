import type * as Datasworn from './Datasworn.js';
import type TypeId from './IdElements/TypeId.js';
declare namespace TypeNode {
    export type Collection = ByType<TypeId.Collection>;
    export type Collectable = ByType<TypeId.Collectable>;
    export type NonCollectable = ByType<TypeId.NonCollectable>;
    type TypeMapLike<T extends string> = {
        [K in T]: {
            type: K;
        };
    };
    type PrimaryTypeMap = TypeMapLike<TypeId.AnyPrimary> & {
        asset_collection: Datasworn.AssetCollection;
        asset: Datasworn.Asset;
        move_category: Datasworn.MoveCategory;
        move: Datasworn.Move;
        atlas_collection: Datasworn.AtlasCollection;
        atlas_entry: Datasworn.AtlasEntry;
        npc_collection: Datasworn.NpcCollection;
        npc: Datasworn.Npc;
        oracle_collection: Datasworn.OracleCollection;
        oracle_rollable: Datasworn.OracleRollable;
        delve_site: Datasworn.DelveSite;
        truth: Datasworn.Truth;
        delve_site_domain: Datasworn.DelveSiteDomain;
        delve_site_theme: Datasworn.DelveSiteTheme;
        rarity: Datasworn.Rarity;
    };
    type EmbedOnlyTypeMap = TypeMapLike<TypeId.EmbedOnlyType> & {
        ability: Datasworn.AssetAbility;
        option: Datasworn.TruthOption;
        row: Datasworn.OracleRollableRow;
        feature: Datasworn.DelveSiteThemeFeature | Datasworn.DelveSiteDomainFeature;
        danger: Datasworn.DelveSiteThemeDanger | Datasworn.DelveSiteDomainDanger;
        denizen: Datasworn.DelveSiteDenizen;
        variant: Datasworn.NpcVariant;
    };
    type EmbeddedTypeMap = EmbedOnlyTypeMap & PrimaryTypeMap;
    export type CollectableOf<T extends Collection> = ByType<TypeId.CollectableOf<T['type']>> & Collectable;
    /** Gets the node type(s) corresponding to a given TypeId. */
    export type ByType<T extends keyof PrimaryTypeMap | keyof EmbeddedTypeMap> = T extends keyof PrimaryTypeMap ? T extends keyof EmbeddedTypeMap ? PrimaryTypeMap[T] | EmbeddedTypeMap[T] : PrimaryTypeMap[T] : T extends keyof EmbeddedTypeMap ? EmbeddedTypeMap[T] : never;
    /** Any Datasworn primary node type. */
    export type AnyPrimary = PrimaryTypeMap[keyof PrimaryTypeMap];
    /** Any Datasworn embedded node type. */
    export type AnyEmbedded = EmbeddedTypeMap[keyof EmbeddedTypeMap];
    /** Any primary or embedded Datasworn node type. */
    export type Any = AnyPrimary | AnyEmbedded;
    export {};
}
export default TypeNode;
