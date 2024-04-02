import type { AnyCollection } from '../Id/Utils.js';
/**
 * Mutates `target`.
 * @param target The collection object to be enhanced.
 * @param source The changes to be applied to `target`
 * @param strictOverrides Should enhancements to collections and collectables require a matching `enhances` or `overrides` property? (default: `true`)
 */
export declare function enhanceCollection<T extends AnyCollection>(target: T, source: T, strictOverrides?: boolean): T;
