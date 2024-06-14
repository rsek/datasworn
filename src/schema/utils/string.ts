import { camelCase } from 'lodash-es'
import { type PascalCase as PascalCaseNoDot } from 'type-fest'
import type { Join, Split } from '../../pkg-core/Utils/String.js'

export function capitalize<Str extends string = string>(str: Str) {
	return (str[0].toLocaleUpperCase('en') + str.slice(1)) as Capitalize<Str>
}

export type PascalCase<T extends string> = PascalCaseNoDot<
	Join<Split<T, '.'>, '_'>
>

export function pascalCase<Str extends string = string>(str: Str) {
	return capitalize(camelCase(str.split('.').join('_'))) as PascalCase<Str>
}
