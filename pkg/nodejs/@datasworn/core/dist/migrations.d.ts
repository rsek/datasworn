/** Utilties to assist in migration of Datasworn data across versions. */
import type NodeTypeId from './IdElements/NodeTypeId.js';
declare const MinorNodeTypes: readonly ["asset_ability_move", "asset_ability"];
type MinorNodeType = (typeof MinorNodeTypes)[number];
export type IdReplacer = {
    /** A regular expression matching the old ID. */
    old: RegExp;
    /** A replacement template string to replace the old ID with. */
    new: string;
};
export type IdReplacementMap = Record<NodeTypeId.Any | MinorNodeType, IdReplacer[]>;
/**
 * Provides an array of {@link IdReplacer} objects for each Datasworn ID type.
 */
export declare const IdReplacementMap: {
    readonly asset_collection: [{
        readonly old: RegExp;
        readonly new: "$1/asset_collection/$2";
    }];
    readonly asset: [{
        readonly old: RegExp;
        readonly new: "$1/asset/$2";
    }];
    readonly atlas_collection: [{
        readonly old: RegExp;
        readonly new: "$1/atlas_collection/$2";
    }];
    readonly atlas_entry: [{
        readonly old: RegExp;
        readonly new: "$1/atlas_entry/$2";
    }];
    readonly delve_site_domain: [{
        readonly old: RegExp;
        readonly new: "$1/delve_site_domain/$2";
    }];
    readonly delve_site_theme: [{
        readonly old: RegExp;
        readonly new: "$1/delve_site_theme/$2";
    }];
    readonly delve_site: [{
        readonly old: RegExp;
        readonly new: "$1/delve_site/$2";
    }];
    readonly move_category: [{
        readonly old: RegExp;
        readonly new: "$1/move_category/$2";
    }];
    readonly move: [{
        readonly old: RegExp;
        readonly new: "$1/move/$2";
    }];
    readonly npc_collection: [{
        readonly old: RegExp;
        readonly new: "$1/npc_collection/$2";
    }];
    readonly npc: [{
        readonly old: RegExp;
        readonly new: "$1/npc/$2";
    }];
    readonly oracle_collection: [{
        readonly old: RegExp;
        readonly new: "$1/oracle_collection/$2";
    }];
    readonly oracle_rollable: [{
        readonly old: RegExp;
        readonly new: "$1/oracle_rollable/$2";
    }];
    readonly rarity: [{
        readonly old: RegExp;
        readonly new: "$1/rarity/$2";
    }];
    readonly truth: [{
        readonly old: RegExp;
        readonly new: "$1/truth/$2";
    }];
    readonly asset_ability_move: [{
        readonly old: RegExp;
        readonly new: "$1/asset/$2.abilities/$3.moves/$4";
    }];
    readonly asset_ability: [{
        readonly old: RegExp;
        readonly new: "$1/asset/$2.abilities/$3";
    }];
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
export declare function updateIdsInString(key: string, value: unknown): unknown;
/**
 *
 * @param md The markdown string to change.
 * @returns A new string with the replaced values.
 */
export declare function updateIdsInMarkdown(md: string): string;
/**
 * Updates a Datasworn ID. The string must consist *only* of an ID, like those found in the `_id` property of many Datasworn nodes.
 *
 * To update IDs within a longer string, see {@link updateIdsInString}.
 * @param oldId The ID to attempt migration on.
 * @param typeHint An optional type hint. If you know the ID type ahead of time, this lets the function skip some iteration over irrelevant ID categories, which might make it faster.
 */
export declare function updateId(oldId: string, typeHint?: keyof IdReplacementMap): string;
/** Applies a replacement from an array of replacer objects to a string; the first matching replacer is used. If no matching replacer is found, returns `null` instead. */
export declare function applyReplacements(str: string, replacers: IdReplacer[]): string;
export {};
