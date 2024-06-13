import type { Datasworn } from '../index.js';
export declare function validate<T extends Datasworn.OracleRollable>(object: T): boolean;
type RowLike = {
    roll: {
        min: number;
        max: number;
    } | null;
};
/**
 *
 * @param a The first row to compare.
 * @param b The second row to compare.
 * @returns `-1` if `a` comes before `b`, `1` if `b` comes before `a`, or `0` if the sort order is unchanged.
 */
export declare function compareRanges(a: RowLike, b: RowLike): 1 | 0 | -1;
export {};
