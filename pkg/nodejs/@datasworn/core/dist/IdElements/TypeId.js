"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_js_1 = __importDefault(require("./CONST.js"));
/**
 * Datasworn ID elements that represent specific types of Datasworn object. They appear in the second position, immediately after the {@link RulesPackageId} element.
 *
 * TypeIds always have the same value as `type` property. In other words, the `type` of the ID's target is always reconstructable from the ID.
 */
var TypeId;
(function (TypeId) {
    /** Object types that can exist in collections. */
    TypeId.Collectable = [
        'atlas_entry',
        'npc',
        'oracle_rollable',
        'asset',
        'move'
    ];
    TypeId.Collection = [
        'atlas_collection',
        'npc_collection',
        'oracle_collection',
        'asset_collection',
        'move_category'
    ];
    /** ID type elements for types that don't use collections at all. */
    TypeId.NonCollectable = [
        'delve_site',
        'delve_site_domain',
        'delve_site_theme',
        'rarity',
        'truth'
    ];
    TypeId.CollectedByMap = {
        asset_collection: 'asset',
        move_category: 'move',
        atlas_collection: 'atlas_entry',
        npc_collection: 'npc',
        oracle_collection: 'oracle_rollable'
    };
    function getCollectableOf(typeId) {
        return TypeId.CollectedByMap[typeId];
    }
    TypeId.getCollectableOf = getCollectableOf;
    TypeId.CollectionOfMap = {
        asset: 'asset_collection',
        move: 'move_category',
        atlas_entry: 'atlas_collection',
        npc: 'npc_collection',
        oracle_rollable: 'oracle_collection'
    };
    function getCollectionOf(typeId) {
        return TypeId.CollectionOfMap[typeId];
    }
    TypeId.getCollectionOf = getCollectionOf;
    TypeId.EmbeddablePrimaryTypes = [
        'oracle_rollable',
        'move'
    ];
    TypeId.EmbedOnlyTypes = ['ability', 'option'];
    TypeId.EmbeddableTypes = [
        'oracle_rollable',
        'move',
        'ability',
        'option'
    ];
    TypeId.EmbeddedTypePaths = [
        'asset.ability',
        'truth.option',
        'move.oracle_rollable'
    ];
    TypeId.EmbedOfEmbedTypePaths = [
        'asset.ability.move',
        'asset.ability.oracle_rollable',
        'truth.option.oracle_rollable'
    ];
    TypeId.RootKeys = {
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
    TypeId.EmbeddedPropertyKeys = {
        ability: 'abilities',
        option: 'options'
    };
    function getRootKey(typeId) {
        const result = TypeId.RootKeys[typeId];
        if (result == null)
            throw new Error(`Expected primary TypeId but got ${typeId}`);
        return result;
    }
    TypeId.getRootKey = getRootKey;
    function getEmbeddedPropertyKey(typeId) {
        const result = typeId in TypeId.EmbeddedPropertyKeys
            ? // @ts-expect-error
                TypeId.EmbeddedPropertyKeys[typeId]
            : null;
        if (result != null)
            return result;
        try {
            return getRootKey(typeId);
        }
        catch (e) {
            throw new Error(`Expected embeddable TypeId but got ${typeId}`);
        }
    }
    TypeId.getEmbeddedPropertyKey = getEmbeddedPropertyKey;
    function getEmbeddableTypes(typeId) {
        const allEmbeddedTypePaths = [
            ...TypeId.EmbeddedTypePaths,
            ...TypeId.EmbedOfEmbedTypePaths
        ];
        const matches = new Set();
        for (const typePath of allEmbeddedTypePaths) {
            const typeHead = typeId + CONST_js_1.default.PathTypeSep;
            if (typePath.startsWith(typeId))
                matches.add(typePath
                    // remove the parts that represent the current path
                    .replace(typeHead, '')
                    // get the first relevant segment
                    .split(CONST_js_1.default.PathTypeSep)[0]);
        }
        return Array.from(matches);
    }
    TypeId.getEmbeddableTypes = getEmbeddableTypes;
})(TypeId || (TypeId = {}));
exports.default = TypeId;
