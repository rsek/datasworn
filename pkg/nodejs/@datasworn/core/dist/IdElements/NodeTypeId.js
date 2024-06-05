"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
var NodeTypeId;
(function (NodeTypeId) {
    let Collectable;
    (function (Collectable) {
        Collectable.Recursive = ['atlas_entry', 'npc', 'oracle_rollable'];
        Collectable.NonRecursive = ['asset', 'move'];
    })(Collectable = NodeTypeId.Collectable || (NodeTypeId.Collectable = {}));
    let Collection;
    (function (Collection) {
        Collection.Recursive = [
            'atlas_collection',
            'npc_collection',
            'oracle_collection'
        ];
        Collection.NonRecursive = ['asset_collection', 'move_category'];
    })(Collection = NodeTypeId.Collection || (NodeTypeId.Collection = {}));
    /** ID type elements for types that don't use collections at all. */
    NodeTypeId.NonCollectable = [
        'delve_site',
        'delve_site_domain',
        'delve_site_theme',
        'rarity',
        'truth'
    ];
    NodeTypeId.CollectedByMap = {
        asset_collection: 'asset',
        move_category: 'move',
        atlas_collection: 'atlas_entry',
        npc_collection: 'npc',
        oracle_collection: 'oracle_rollable'
    };
    function getCollectableOf(typeId) {
        return NodeTypeId.CollectedByMap[typeId];
    }
    NodeTypeId.getCollectableOf = getCollectableOf;
    NodeTypeId.CollectionOfMap = {
        asset: 'asset_collection',
        move: 'move_category',
        atlas_entry: 'atlas_collection',
        npc: 'npc_collection',
        oracle_rollable: 'oracle_collection'
    };
    function getCollectionOf(typeId) {
        return NodeTypeId.CollectionOfMap[typeId];
    }
    NodeTypeId.getCollectionOf = getCollectionOf;
    NodeTypeId.RootKeys = {
        asset_collection: 'assets',
        asset: 'assets',
        move_category: 'moves',
        move: 'moves',
        atlas_collection: 'atlas',
        atlas_entry: 'atlas',
        npc_collection: 'npcs',
        npc: 'npcs',
        oracle_collection: 'oracles',
        oracle_rollable: 'oracles',
        delve_site: 'delve_sites',
        truth: 'truths',
        delve_site_domain: 'site_domains',
        delve_site_theme: 'site_themes',
        rarity: 'rarities'
    };
    function getRootKey(typeId) {
        return NodeTypeId.RootKeys[typeId];
    }
    NodeTypeId.getRootKey = getRootKey;
})(NodeTypeId || (NodeTypeId = {}));
exports.default = NodeTypeId;
