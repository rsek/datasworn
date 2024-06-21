/** Utilties to assist in migration of Datasworn data across versions. */
import TypeId from '../IdElements/TypeId.js';
export type IdReplacer = {
    /** A regular expression matching the old ID. */
    old: RegExp;
    /** A replacement template string to replace the old ID with, or `null` if this ID explicitly has no equivalent. */
    new: string | null;
};
export type IdReplacementMap = Record<TypeId.Primary | TypeId.EmbedOnly, IdReplacer[]>;
/**
 * Provides an array of {@link IdReplacer} objects for each Datasworn ID type.
 */
export declare const idReplacers: {
    oracle_rollable: IdReplacer[];
    oracle_collection: {
        old: RegExp;
        new: any;
    }[];
    variant: {
        old: RegExp;
        new: string;
    }[];
    ability: {
        old: RegExp;
        new: string;
    }[];
    move: {
        old: RegExp;
        new: string;
    }[];
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
