"use strict";
/** Utilties to assist in migration of Datasworn data across versions. */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyReplacements = exports.updateId = exports.updateIdsInMarkdown = exports.updateIdsInString = exports.IdReplacementMap = void 0;
const CONST_js_1 = __importDefault(require("./IdElements/CONST.js"));
const MinorNodeTypes = ['asset_ability_move', 'asset_ability'];
/**
 * Provides an array of {@link IdReplacer} objects for each Datasworn ID type.
 */
exports.IdReplacementMap = {
    asset_collection: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/assets\/(?<path>[a-z_/*]+)$/,
            new: 'asset_collection:$1/$2'
        }
    ],
    asset: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>[a-z_/*]+)$/,
            new: 'asset:$1/$2'
        }
    ],
    atlas_collection: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/atlas\/(?<path>[a-z_/*]+)$/,
            new: 'atlas_collection:$1/$2'
        }
    ],
    atlas_entry: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/atlas\/(?<path>[a-z_/*]+)$/,
            new: 'atlas_entry:$1/$2'
        }
    ],
    delve_site_domain: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/site_domains\/(?<path>[a-z_/*]+)$/,
            new: 'delve_site_domain:$1/$2'
        }
    ],
    delve_site_theme: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/site_themes\/(?<path>[a-z_/*]+)$/,
            new: 'delve_site_theme:$1/$2'
        }
    ],
    delve_site: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/delve_sites\/(?<path>[a-z_/*]+)$/,
            new: 'delve_site:$1/$2'
        }
    ],
    move_category: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/moves\/(?<path>[a-z_/*]+)$/,
            new: 'move_category:$1/$2'
        }
    ],
    move: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/moves\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))$/,
            new: 'move:$1/$2'
        }
    ],
    npc_collection: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/npcs\/(?<path>[a-z_/*]+)$/,
            new: 'npc_collection:$1/$2'
        }
    ],
    npc: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/npcs\/(?<path>[a-z_/*]+)$/,
            new: 'npc:$1/$2'
        }
    ],
    oracle_collection: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/collections\/oracles\/(?<path>[a-z_/*]+)$/,
            new: 'oracle_collection:$1/$2'
        }
    ],
    oracle_rollable: [
        // TODO: add specific overrides for move oracles
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/oracles\/(?<path>[a-z_/*]+)$/,
            new: 'oracle_rollable:$1/$2'
        }
    ],
    rarity: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/rarities\/(?<path>[a-z_/*]+)$/,
            new: 'rarity:$1/$2'
        }
    ],
    truth: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/truths\/(?<path>[a-z_/*]+)$/,
            new: 'truth:$1/$2'
        }
    ],
    asset_ability_move: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(?<index>\*|\d+)\/moves\/(?<key>\*|[a-z][a-z_]*)$/,
            new: 'asset.ability.move:$1/$2.$3.$4'
        }
    ],
    asset_ability: [
        {
            old: /^(?<pkg>\*|[a-z][a-z0-9_]{3,})\/assets\/(?<path>(?:\*|[a-z][a-z_]*)\/(?:\*|[a-z][a-z_]*))\/abilities\/(?<index>\*|\d+)$/,
            new: 'asset.ability:$1/$2.$3'
        }
    ]
};
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
        case !str.includes(CONST_js_1.default.PathSep):
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
const markdownMacroPattern = /(?<=\{\{[a-z_]+:)[a-z_\/\.\d]+?(?=\}\})/g;
/**
 * Matches *only* the actual ID.
 * @example "[Legacy](id:starforged/oracle_rollable/factions/name/legacy)"
 */
const markdownLinkPattern = /(?<=\[\w.+\]\(id:)[a-z_\/\.\d]+?(?=\))/g;
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
    if (typeHint != null && typeHint in exports.IdReplacementMap) {
        // type is already known, so we can skip straight to running the replacements
        const replacers = exports.IdReplacementMap[typeHint];
        return (_a = applyReplacements(oldId, replacers)) !== null && _a !== void 0 ? _a : oldId;
    }
    else {
        // unknown type, run all of them until one sticks
        for (const typeId in exports.IdReplacementMap) {
            const replacers = exports.IdReplacementMap[typeId];
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
