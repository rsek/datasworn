import { camelCase } from 'lodash-es'
import { type PascalCase } from 'type-fest'

export function capitalize<Str extends string = string>(str: Str) {
	return (str[0].toLocaleUpperCase('en') + str.slice(1)) as Capitalize<Str>
}

export function pascalCase<Str extends string = string>(str: Str) {
	return capitalize(camelCase(str)) as PascalCase<Str>
}
