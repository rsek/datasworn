import type * as IdElements from '../IdElements/index.js'

// cribbed from type-fest

export type Split<
	S extends string,
	Delimiter extends string = IdElements.CONST.Sep
> = S extends `${infer Head}${Delimiter}${infer Tail}`
	? [Head, ...Split<Tail, Delimiter>]
	: S extends Delimiter
		? []
		: [S]

export type Join<
	Strings extends string[],
	Delimiter extends string = IdElements.CONST.Sep
> = Strings extends [infer U extends string]
	? U
	: Strings extends [infer Head extends string, ...infer Tail extends string[]]
		? `${Head}${Delimiter}${Join<Tail, Delimiter>}`
		: never
