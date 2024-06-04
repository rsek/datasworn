export declare function arrayIs<T1 extends Array<any>, T2 extends Array<any>>(a: T1, b: T2): a is T1 & T2;
export type Last<T extends unknown[]> = T extends [infer U] ? U : T extends [...T[number][], infer U] ? U : never;
export type DropLast<T extends unknown[]> = T extends [T[number]] ? [] : T extends [...infer U extends T[number][], T[number]] ? U : never;
export type Head<T extends unknown[]> = T extends [
    ...infer Head extends unknown[],
    unknown
] ? Head : never;
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
