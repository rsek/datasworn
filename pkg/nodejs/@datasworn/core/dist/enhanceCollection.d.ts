import type DataswornNode from './DataswornNode.js';
/**
 * Applies overrides to Datasworn collection from another Datasworn collection.
 * Mutates `target`.
 * @param target The collection object to be enhanced.
 * @param source The changes to be applied to `target`
 * @param strictOverrides Should enhancements to collections and collectables require a matching `enhances` or `overrides` property? (default: `true`)
 * @returns The mutated `target`
 * @experimental
 */
export declare function enhanceCollection<T extends DataswornNode.Collection.Any>(target: T, source: T, strictOverrides?: boolean): T;
