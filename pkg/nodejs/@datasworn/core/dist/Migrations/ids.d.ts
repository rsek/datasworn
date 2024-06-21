/**
 *
 * @param k The key of the JSON value.
 * @param v The JSON value.
 * @param replacementMap
 * @param unreplacedIds An optional set that contains any IDs that were unable to be replaced.
 * @example ```typescript
 * const [replacementMap, oldJson] = await Promise.all([
 *   fs.readFile('./path/to/id_replacement_hash.json'),
 *   fs.readFile('./path/to/old_datasworn_data.json')
 * ])
 * const unreplacedIds = new Set<string>()
 *
 * // parse and do ID replacements
 * const updated = JSON.parse(oldJson, (k,v) => updateIdsInString(k,v,replacementMap, unreplacedIds))
 * ```
 */
export declare function updateIdInString(k: unknown, v: unknown, replacementMap: Record<string, string | null>, unreplacedIds?: Set<string>): unknown;
/**
 * Updates markdown ID pointers and templates from v0.0.10 to v0.1.0.
 * @param md The markdown string to change.
 * @returns A new string with the replaced values.
 */
export declare function updateIdsInMarkdown(md: string, replacementMap: Record<string, string | null>, unreplacedIds?: Set<string>): string;
export declare function updateId(id: string, replacementMap: Record<string, string | null>, unreplacedIds?: Set<string>): string | null;
