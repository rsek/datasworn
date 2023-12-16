import type * as Datasworn from '../../../Datasworn.js';
import type * as Id from './StringTemplateLiterals.js';
export interface TypesByName {
    AssetCollection: Datasworn.AssetCollection;
    Atlas: Datasworn.Atlas;
    MoveCategory: Datasworn.MoveCategory;
    NpcCollection: Datasworn.NpcCollection;
    OracleCollection: Datasworn.OracleCollection;
    Asset: Datasworn.Asset;
    AtlasEntry: Datasworn.AtlasEntry;
    DelveSite: Datasworn.DelveSite;
    Move: Datasworn.Move;
    Npc: Datasworn.Npc;
    OracleRollable: Datasworn.OracleRollable;
    Rarity: Datasworn.Rarity;
    DelveSiteDomain: Datasworn.DelveSiteDomain;
    DelveSiteTheme: Datasworn.DelveSiteTheme;
    Truth: Datasworn.Truth;
}
export interface IdsByTypeName extends Record<keyof TypesByName, Id.AnyId> {
    AssetCollection: Id.CollectionId<'assets'>;
    Atlas: Id.CollectionId<'atlas'>;
    MoveCategory: Id.CollectionId<'moves'>;
    NpcCollection: Id.CollectionId<'npcs'>;
    OracleCollection: Id.CollectionId<'oracles'>;
    Asset: Id.CollectableId<'assets'>;
    AtlasEntry: Id.CollectableId<'atlas'>;
    Move: Id.CollectableId<'moves'>;
    Npc: Id.CollectableId<'npcs'>;
    OracleRollable: Id.CollectableId<'oracles'>;
    DelveSite: Id.NonCollectableId<'delve_sites'>;
    Rarity: Id.NonCollectableId<'rarities'>;
    DelveSiteDomain: Id.NonCollectableId<'site_domains'>;
    DelveSiteTheme: Id.NonCollectableId<'site_themes'>;
    Truth: Id.NonCollectableId<'truths'>;
}
export declare const TypeCompositesByName: {
    readonly AssetCollection: "collections/assets";
    readonly Atlas: "collections/atlas";
    readonly MoveCategory: "collections/moves";
    readonly NpcCollection: "collections/npcs";
    readonly OracleCollection: "collections/oracles";
    readonly Asset: "assets";
    readonly AtlasEntry: "atlas";
    readonly DelveSite: "delve_sites";
    readonly Move: "moves";
    readonly Npc: "npcs";
    readonly OracleRollable: "oracles";
    readonly Rarity: "rarities";
    readonly DelveSiteDomain: "site_domains";
    readonly DelveSiteTheme: "site_themes";
    readonly Truth: "truths";
};
export type TypeCompositesByName = typeof TypeCompositesByName;
export declare const NamesByTypeComposite: {
    readonly 'collections/assets': "AssetCollection";
    readonly 'collections/atlas': "Atlas";
    readonly 'collections/moves': "MoveCategory";
    readonly 'collections/npcs': "NpcCollection";
    readonly 'collections/oracles': "OracleCollection";
    readonly assets: "Asset";
    readonly atlas: "AtlasEntry";
    readonly delve_sites: "DelveSite";
    readonly moves: "Move";
    readonly npcs: "Npc";
    readonly oracles: "OracleRollable";
    readonly rarities: "Rarity";
    readonly site_domains: "DelveSiteDomain";
    readonly site_themes: "DelveSiteTheme";
    readonly truths: "Truth";
};
export type NamesByTypeComposite = {
    [K in keyof typeof NamesByTypeComposite]: TypesByName[(typeof NamesByTypeComposite)[K]];
};
