"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamesByNonCollectableType = exports.NamesByCollectableType = exports.NamesByCollectionSubtype = exports.NamesByTypeComposite = exports.TypeCompositesByName = void 0;
exports.TypeCompositesByName = {
    AssetCollection: 'collections/assets',
    AtlasCollection: 'collections/atlas',
    MoveCategory: 'collections/moves',
    NpcCollection: 'collections/npcs',
    OracleCollection: 'collections/oracles',
    Asset: 'assets',
    AtlasEntry: 'atlas',
    DelveSite: 'delve_sites',
    Move: 'moves',
    Npc: 'npcs',
    OracleRollable: 'oracles',
    Rarity: 'rarities',
    DelveSiteDomain: 'site_domains',
    DelveSiteTheme: 'site_themes',
    Truth: 'truths'
};
exports.NamesByTypeComposite = {
    'collections/assets': 'AssetCollection',
    'collections/atlas': 'AtlasCollection',
    'collections/moves': 'MoveCategory',
    'collections/npcs': 'NpcCollection',
    'collections/oracles': 'OracleCollection',
    assets: 'Asset',
    atlas: 'AtlasEntry',
    delve_sites: 'DelveSite',
    moves: 'Move',
    npcs: 'Npc',
    oracles: 'OracleRollable',
    rarities: 'Rarity',
    site_domains: 'DelveSiteDomain',
    site_themes: 'DelveSiteTheme',
    truths: 'Truth'
};
exports.NamesByCollectionSubtype = {
    assets: 'AssetCollection',
    atlas: 'AtlasCollection',
    moves: 'MoveCategory',
    npcs: 'NpcCollection',
    oracles: 'OracleCollection'
};
exports.NamesByCollectableType = {
    assets: 'Asset',
    atlas: 'AtlasEntry',
    moves: 'Move',
    npcs: 'Npc',
    oracles: 'OracleRollable'
};
exports.NamesByNonCollectableType = {
    delve_sites: 'DelveSite',
    rarities: 'Rarity',
    site_domains: 'DelveSiteDomain',
    site_themes: 'DelveSiteTheme',
    truths: 'Truth'
};
