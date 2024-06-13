"use strict";
/** Utilties to assist in migration of Datasworn data across versions. */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReplacements = exports.updateId = exports.updateIdsInMarkdown = exports.updateIdsInString = void 0;
const CONST_js_1 = __importDefault(require("./IdElements/CONST.js"));
const TypeId_js_1 = __importDefault(require("./IdElements/TypeId.js"));
const index_js_1 = require("./IdElements/index.js");
const MinorNodeTypes = ['asset.ability.move', 'asset.ability'];
const legacyTypeMap = {
    // new_type: 'old_type'
    asset: 'assets',
    move: 'moves',
    atlas_entry: 'atlas',
    npc: 'npcs',
    oracle_rollable: 'oracles',
    delve_site: 'delve_sites',
    truth: 'truths',
    delve_site_domain: 'site_domains',
    delve_site_theme: 'site_themes',
    rarity: 'rarities',
    oracle_collection: 'collections/oracles',
    npc_collection: 'collections/npcs',
    asset_collection: 'collections/assets',
    move_category: 'collections/moves',
    atlas_collection: 'collections/atlas'
};
const keyRenamesByPkgAndType = {
    starforged: {
        // these will cascade down to any child collectables, too
        oracle_collection: {
            // new_key: 'old_key'
            faction: 'factions',
            derelict: 'derelicts',
            location_theme: 'location_themes',
            planet: 'planets',
            settlement: 'settlements',
            starship: 'starships',
            precursor_vault: 'vaults',
            character: 'characters',
            creature: 'creatures',
            'derelict/zone': 'derelicts/zones'
        }
    },
    classic: {},
    delve: {}
};
function createKeyRenamersForType(typeId) {
    var _a;
    const oldType = ((_a = legacyTypeMap[typeId]) !== null && _a !== void 0 ? _a : legacyTypeMap[typeId]);
    const renamers = [];
    for (const pkgId in keyRenamesByPkgAndType) {
        const pkgKeyRenames = keyRenamesByPkgAndType[pkgId];
        if (typeId in pkgKeyRenames) {
            const typeRenames = pkgKeyRenames[typeId];
            for (const newKey in typeRenames) {
                const oldKey = typeRenames[newKey];
                renamers.push({
                    old: RegExp(`^${pkgId}/${oldType}/${oldKey}((?:\\/[a-z_/*\\d]+){0,})$`),
                    new: `${typeId}${CONST_js_1.default.PrefixSep}${pkgId}${CONST_js_1.default.PathKeySep}${newKey}$1`
                });
            }
        }
        const collectionTypeId = index_js_1.TypeGuard.CollectableType(pkgId)
            ? TypeId_js_1.default.getCollectionOf(pkgId)
            : null;
        if (collectionTypeId != null && collectionTypeId in pkgKeyRenames) {
            const collectionTypeRenames = pkgKeyRenames[collectionTypeId];
            for (const newKey in collectionTypeRenames) {
                const oldKey = collectionTypeRenames[newKey];
                renamers.push({
                    old: RegExp(
                    // minimum tail repeat of 1 because a child collectable would always have its own key
                    `^${pkgId}/${oldType}/${oldKey}((?:\\/[a-z_/*\\d]+){1,})$`),
                    new: `${typeId}${CONST_js_1.default.PrefixSep}${pkgId}${CONST_js_1.default.PathKeySep}${newKey}$1`
                });
            }
        }
    }
    return renamers;
}
function createIdMappers(typeId) {
    var _a;
    const oldType = ((_a = legacyTypeMap[typeId]) !== null && _a !== void 0 ? _a : legacyTypeMap[typeId]);
    const mappers = [
        // these mappers are more specific, so they go first
        ...createKeyRenamersForType(typeId),
        // generic mapper to apply if none of the others match
        {
            old: new RegExp(`^(\\*|[a-z][a-z0-9_]{3,})/${oldType}((?:\\/[a-z_/*\\d]+){1,})$`),
            new: `${typeId}${CONST_js_1.default.PrefixSep}$1${CONST_js_1.default.PathKeySep}$2`
        }
    ];
    return mappers;
}
function createMoveOracleIdMapper(rulesPackage, moveCategoryKey, moveKey, newOracleKey = moveKey, oldOracleKey) {
    const newTypeId = ['move', 'oracle_rollable'].join(CONST_js_1.default.PathTypeSep);
    const newMovePath = [rulesPackage, moveCategoryKey, moveKey].join(CONST_js_1.default.PathKeySep);
    const newFullPath = [newMovePath, newOracleKey].join(CONST_js_1.default.PathTypeSep);
    return {
        old: new RegExp(`^${rulesPackage}/oracles/moves/${moveKey}${oldOracleKey ? '/' + oldOracleKey : ''}$`),
        new: [newTypeId, newFullPath].join(CONST_js_1.default.PrefixSep)
    };
}
/**
 * Provides an array of {@link IdReplacer} objects for each Datasworn ID type.
 */
const IdReplacementMap = {
    // set highest priority replacments first
    oracle_rollable: [
        ...['starforged', 'classic'].flatMap((pkg) => [
            createMoveOracleIdMapper(pkg, 'suffer', 'endure_harm'),
            createMoveOracleIdMapper(pkg, 'suffer', 'endure_stress'),
            createMoveOracleIdMapper(pkg, 'fate', 'pay_the_price'),
            ...[
                'almost_certain',
                'likely',
                'fifty_fifty',
                'unlikely',
                'small_chance'
            ].map((k) => createMoveOracleIdMapper(pkg, 'fate', 'ask_the_oracle', k, k))
        ]),
        ...['edge', 'wits', 'shadow'].map((k) => createMoveOracleIdMapper('delve', 'delve', 'delve_the_depths', k)),
        createMoveOracleIdMapper('delve', 'delve', 'find_an_opportunity'),
        createMoveOracleIdMapper('delve', 'delve', 'reveal_a_danger'),
        createMoveOracleIdMapper('delve', 'delve', 'reveal_a_danger_alt'),
        createMoveOracleIdMapper('delve', 'threat', 'advance_a_threat'),
        createMoveOracleIdMapper('starforged', 'session', 'begin_a_session'),
        createMoveOracleIdMapper('starforged', 'exploration', 'make_a_discovery'),
        createMoveOracleIdMapper('starforged', 'exploration', 'confront_chaos'),
        createMoveOracleIdMapper('starforged', 'combat', 'take_decisive_action'),
        createMoveOracleIdMapper('starforged', 'suffer', 'withstand_damage')
    ],
    ability: [
        {
            // asset abilities
            old: /^(\*|[a-z][a-z0-9_]{3,})\/assets\/((?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(\*|\d+)$/,
            new: 'asset.ability:$1/$2.$3'
        }
    ],
    move: [
        {
            // asset ability moves
            old: /^(\*|[a-z][a-z0-9_]{3,})\/assets\/((?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(\*|\d+)\/moves\/(\*|[a-z][a-z_]*)$/,
            new: 'asset.ability.move:$1/$2.$3.$4'
        }
    ]
};
for (const typeId in legacyTypeMap) {
    IdReplacementMap[typeId] || (IdReplacementMap[typeId] = []);
    IdReplacementMap[typeId].push(...createIdMappers(typeId));
}
// sort all by the number of '.' chars in the replacement, or length otherwise
console.log(Object.fromEntries(Object.entries(IdReplacementMap)
    .flatMap(([k, v]) => v.map((e) => [e.old.source, e.new]))
    .sort(([patternA, replacementA], [patternB, replacementB]) => {
    const initialWildcard = '(\\*';
    const anyPipe = '|';
    const anyCapture = '$';
    switch (true) {
        case replacementA.includes(anyCapture) &&
            !replacementB.includes(anyCapture):
        case patternA.startsWith(initialWildcard) &&
            !patternB.startsWith(initialWildcard):
        case patternA.includes(anyPipe) && !patternB.includes(anyPipe):
            return 1;
        case !replacementA.includes(anyCapture) &&
            replacementB.includes(anyCapture):
        case !patternA.startsWith(initialWildcard) &&
            patternB.startsWith(initialWildcard):
        case !patternA.includes(anyPipe) && patternB.includes(anyPipe):
            return -1;
        default: {
            // use number of captures as proxy for variability. more variable => lower on list
            const captureCountDifference = patternB.split(anyCapture).length -
                patternA.split(anyCapture).length;
            if (captureCountDifference !== 0)
                return captureCountDifference;
            // use number of path separators as a proxy for specificity. more specific => higher on list
            const slashCountDifference = patternA.split(CONST_js_1.default.PathKeySep).length -
                patternB.split(CONST_js_1.default.PathKeySep).length;
            return slashCountDifference;
        }
    }
})));
/**
 * Updates old (pre-0.1.0) Datasworn IDs (and pointers that reference them in markdown strings) for use with v0.1.0.
 * Intended for use as the `replacer` in {@link JSON.stringify} or the `reviver` in {@link JSON.parse}; this way, it will iterate over every string value so you can update all the IDs in one go.
 *
 * NOTE: This function assumes that Datasworn's markdown formatting is mostly intact. If you diverge,
 *
 * @param key The JSON value's key. Not actually used right now, but retained so it's parameters are consistent with the typical replacer/reviver functions.
 * @param value The JSON value itself.
 * @returns The updated string value, or the original string value if no changes were made.
 * @example ```typescript
 * // Read old data asynchronously
 * const oldJson = await fs.readFile('./path/to/old_datasworn_data.json')
 * // parse and do ID replacements
 * const updated = JSON.parse(oldJson, updateIdsInString)
 * ```
 */
function updateIdsInString(key, value) {
    const str = value;
    switch (true) {
        // *all* relevant IDs include this character;
        // strings without them can be safely ignored.
        // won't match a RulesPackageId, but we don't
        // care about them.
        case typeof value !== 'string':
        case !str.includes(CONST_js_1.default.PathKeySep):
            return value;
        // implies a markdown ID reference.
        case str.includes('['):
        case str.includes('{{'):
            return updateIdsInMarkdown(value);
        // if it's come this far, it's either
        // * a complete ID
        // * a string with a plain text separator character
        // only the former is relevant.
        default:
            return updateId(value);
    }
    // skip if it's not a string
    // skip if it has no slash characters -- all replaced IDs have them
}
exports.updateIdsInString = updateIdsInString;
/**
 * Matches *only* the actual ID.
 * @example "{{text:starforged/oracle_rollable/factions/name/legacy}}"
 */
const markdownMacroPattern = /(?<=\{\{[a-z_]+:)[a-z_\\/\\.\d]+?(?=\}\})/g;
/**
 * Matches *only* the actual ID.
 * @example "[Legacy](id:starforged/oracle_rollable/factions/name/legacy)"
 */
const markdownLinkPattern = /(?<=\[\w.+\]\(id:)[a-z_\\/\\.\d]+?(?=\))/g;
const markdownIdPatterns = [markdownMacroPattern, markdownLinkPattern];
/**
 *
 * @param md The markdown string to change.
 * @returns A new string with the replaced values.
 */
function updateIdsInMarkdown(md) {
    let newStr = md;
    for (const pattern of markdownIdPatterns)
        newStr = newStr.replaceAll(pattern, updateId);
    return newStr;
}
exports.updateIdsInMarkdown = updateIdsInMarkdown;
/**
 * Updates a Datasworn ID. The string must consist *only* of an ID, like those found in the `_id` property of many Datasworn nodes.
 *
 * To update IDs within a longer string, see {@link updateIdsInString}.
 * @param oldId The ID to attempt migration on.
 * @param typeHint An optional type hint. If you know the ID type ahead of time, this lets the function skip some iteration over irrelevant ID categories, which might make it faster.
 */
function updateId(oldId, typeHint) {
    var _a;
    if (typeHint != null && typeHint in IdReplacementMap) {
        // type is already known, so we can skip straight to running the replacements
        const replacers = IdReplacementMap[typeHint];
        return (_a = applyReplacements(oldId, replacers)) !== null && _a !== void 0 ? _a : oldId;
    }
    else {
        // unknown type, run all of them until one sticks
        for (const typeId in IdReplacementMap) {
            const replacers = IdReplacementMap[typeId];
            const newId = applyReplacements(oldId, replacers);
            if (newId == null)
                continue;
            return newId;
        }
    }
    // fall back to old id
    return oldId;
}
exports.updateId = updateId;
/** Applies a replacement from an array of replacer objects to a string; the first matching replacer is used. If no matching replacer is found, returns `null` instead. */
function applyReplacements(str, replacers) {
    for (const replacer of replacers)
        if (replacer.old.test(str))
            return str.replace(replacer.old, replacer.new);
    // if no replacement is found, return null
    return null;
}
exports.applyReplacements = applyReplacements;
