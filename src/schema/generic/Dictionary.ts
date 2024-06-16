import {
	Type,
	type ObjectOptions,
	type TRecord,
	type TSchema,
	type TString
} from '@sinclair/typebox'

import Id from '../common/Id.js'

export const DictionaryBrand = Symbol('Dictionary')

/**
 *
 * @param schema The schema to use as the dictionary value.
 * @param key The schema to use as the dictionary key (default: Id.DictKey)
 * @param options Any object options to apply to this schema.
 */
export function Dictionary<T extends TSchema>(
	schema: T,
	{ key, ...options }: { key?: TString } & ObjectOptions = { key: Id.DictKey }
) {
	const dict =
		// Type.Transform(
		Type.Record(key ?? Id.DictKey, schema, {
			default: {},
			...options,
			remarks: 'Deserialize as a dictionary object.',
			[DictionaryBrand]: 'Dictionary'
		}) as TDictionary<T>
	// )
	// .Decode((value) => new Map<string, Static<T>>(Object.entries(value)))
	// .Encode((value) => Object.fromEntries(Array.from(value.entries())))

	return dict
}
export type TDictionary<T extends TSchema = TSchema> = TRecord<TString, T> & {
	[DictionaryBrand]: 'Dictionary'
}
export type Dictionary<T> = Record<string, T>
