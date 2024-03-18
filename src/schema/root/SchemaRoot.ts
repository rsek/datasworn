import { CloneType, type SchemaOptions, type TSchema } from '@sinclair/typebox'
import { mapValues } from 'lodash-es'
import { SourceData } from './SourceData.js'
import { type Defs } from '../Defs.js'
import { defsKey } from '../../scripts/const.js'

export interface RootOptions
	extends Required<
		Omit<SchemaOptions, 'default' | 'readOnly' | 'writeOnly' | 'examples'>
	> {
	$id: `${'https' | 'http'}://${string}`
	[typeof defsKey]: Defs
	$schema: string
	title: string
}

export type TRoot<T extends TSchema = TSchema> = T & RootOptions

export function SchemaRoot<T extends TSchema, Options extends RootOptions>(
	base: T,
	options: Options
) {
	return CloneType(base, {
		...options,
		[defsKey]: mapValues(options[defsKey], (v, k) =>
			CloneType(v, { title: k })
		) as Defs
	}) as unknown as TRoot
}

export function InputSchemaRoot<T extends TSchema, Options extends RootOptions>(
	base: T,
	options: Options
) {
	return CloneType(base, {
		...options,
		[defsKey]: mapValues(options[defsKey], (v, k) =>
			SourceData(v, { title: k })
		) as Defs
	}) as unknown as TRoot
}
