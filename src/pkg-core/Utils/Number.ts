// these two types originally from https://stackoverflow.com/questions/39494689/is-it-possible-to-restrict-number-to-a-certain-range/70307091#comment127925458_70307091

type Enumerate<
	N extends number,
	Acc extends number[] = []
> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>

/** A Union of integer values from F to T, exclusive */
export type Range<F extends number, T extends number> = Exclude<
	Enumerate<T>,
	Enumerate<F>
>
