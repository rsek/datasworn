export declare function arrayIs<T1 extends Array<any>, T2 extends Array<any>>(a: T1, b: T2): a is T1 & T2;
export type Head<T extends any[]> = T extends [...infer Head, LastElementOf<T>] ? [...Head] : T extends [] ? [] : never;
export type LastElementOf<T extends unknown[]> = T extends [
    ...unknown[],
    infer Last
] ? Last : never;
export type TupleOfLength<Length extends number, T> = T[] & {
    length: Length;
};
export type OmitItemsOfType<T extends any[], O> = T extends [
    infer Head extends any,
    ...infer Tail extends any[]
] ? [...(Head extends O ? [] : [Head]), ...OmitItemsOfType<Tail, O>] : [];