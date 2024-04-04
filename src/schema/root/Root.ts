import {
	CloneType,
	Type,
	type SchemaOptions,
	type TSchema
} from '@sinclair/typebox'
import { mapValues } from 'lodash-es'
import { SourceData } from './SourceData.js'
import { type Defs } from '../Defs.js'
import { DefsKey, VERSION } from '../../scripts/const.js'
import * as Utils from '../Utils.js'
import { Metadata, Version } from '../index.js'

export interface RootOptions extends SchemaOptions {
	$id: `${'https' | 'http'}://${string}`
	[DefsKey]: Defs
	$schema: string
	title: string
}

export type TRoot<T extends TSchema = TSchema> = T & RootOptions

export function RootObject<T extends TSchema, Options extends RootOptions>(
	base: T,
	options: Options
) {
	const rootOptions = {
		...options,
		[DefsKey]: mapValues(options[DefsKey], (v, k) =>
			CloneType(v, { title: k })
		) as Defs
	}

	return CloneType(base, rootOptions) as unknown as TRoot<T>
}

export function SourceRootObject<
	T extends TSchema,
	Options extends RootOptions
>(base: T, options: Options) {
	return CloneType(base, {
		...options,

		[DefsKey]: mapValues(options[DefsKey], (v, k) =>
			SourceData(CloneType(v, { title: k }))
		) as Defs
	}) as unknown as TRoot
}
