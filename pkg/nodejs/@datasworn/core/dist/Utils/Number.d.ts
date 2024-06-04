type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
/** A Union of integer values from F to T, exclusive */
export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
export {};
