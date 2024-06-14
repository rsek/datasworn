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
    TypeId.AnyPrimary = [
        ...TypeId.Collectable,
        ...TypeId.Collection,
        ...TypeId.NonCollectable
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
    TypeId.EmbeddablePrimaryType = [
        'oracle_rollable',
        'move'
    ];
    TypeId.EmbedOnlyType = [
        'ability',
        'option',
        'row',
        'feature',
        'danger',
        'denizen'
    ];
    TypeId.EmbeddableType = [
        'oracle_rollable',
        'move',
        'ability',
        'option',
        'row',
        'feature',
        'danger',
        'denizen'
    ];
    TypeId.EmbedTypeMap = {
        asset: ['ability'],
        ability: ['move', 'oracle_rollable'],
        truth: ['option'],
        option: ['oracle_rollable'],
        move: ['oracle_rollable'],
        oracle_rollable: ['row'],
        delve_site: ['denizen'],
        delve_site_domain: ['feature', 'danger'],
        delve_site_theme: ['feature', 'danger']
    };
    TypeId.AllowedEmbedInEmbedTypes = {
        ability: ['oracle_rollable', 'move'],
        move: [],
        option: ['oracle_rollable'],
        oracle_rollable: ['row']
    };
    function canHaveEmbed(typeId, typeIsEmbedded = false) {
        return getEmbeddableTypes(typeId, typeIsEmbedded).length > 0;
    }
    TypeId.canHaveEmbed = canHaveEmbed;
    function canBeEmbedded(typeId) {
        return getTypesThatCanHaveEmbedOfType(typeId).length > 0;
    }
    TypeId.canBeEmbedded = canBeEmbedded;
    function isPrimary(typeId) {
        return TypeId.AnyPrimary.includes(typeId);
    }
    TypeId.isPrimary = isPrimary;
    function isEmbedOnly(typeId) {
        return TypeId.EmbedOnlyType.includes(typeId);
    }
    TypeId.isEmbedOnly = isEmbedOnly;
    function getEmbeddableTypes(typeId, typeIsEmbedded = false) {
        var _a, _b;
        if (typeIsEmbedded)
            return (_a = TypeId.AllowedEmbedInEmbedTypes[typeId]) !== null && _a !== void 0 ? _a : [];
        return (_b = TypeId.EmbedTypeMap[typeId]) !== null && _b !== void 0 ? _b : [];
    }
    TypeId.getEmbeddableTypes = getEmbeddableTypes;
    function getTypesThatCanHaveEmbedOfType(typeId) {
        const typeIds = [];
        for (const embedder in TypeId.EmbedTypeMap) {
            const embeddables = TypeId.EmbedTypeMap[embedder];
            if (embeddables.includes(typeId))
                typeIds.push(embedder);
        }
        return typeIds;
    }
    TypeId.getTypesThatCanHaveEmbedOfType = getTypesThatCanHaveEmbedOfType;
    TypeId.EmbeddedTypePath = [];
    function expandTypePath(typeId, path = []) {
        var _a;
        const isPrimary = path.length === 0;
        const thisPath = [...path, typeId];
        if (!isPrimary)
            TypeId.EmbeddedTypePath.push(thisPath.join(CONST_js_1.default.PathTypeSep));
        if (typeId in TypeId.EmbedTypeMap) {
            for (const childTypeId of TypeId.EmbedTypeMap[typeId])
                if (isPrimary ||
                    ((_a = TypeId.AllowedEmbedInEmbedTypes[typeId]) !== null && _a !== void 0 ? _a : []).includes(childTypeId))
                    expandTypePath(childTypeId, thisPath);
        }
    }
    for (const typeId in TypeId.EmbedTypeMap)
        expandTypePath(typeId);
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
        option: 'options',
        row: 'rows',
        feature: 'features',
        danger: 'dangers',
        denizen: 'denizens'
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
})(TypeId || (TypeId = {}));
exports.default = TypeId;
