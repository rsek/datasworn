import { Type, type Static, type TSchema, type Kind } from '@sinclair/typebox'
import { UnionEnum } from '../schema/Utils.js'
import { type Simplify, type JsonTypeDef } from '../schema/Symbols.js'
import { type Metadata } from './json-typedef/typedef.js'

export namespace Keywords {
	export const releaseStage = UnionEnum(['experimental', 'release'], {
		default: 'release'
	})
	export const i18n = Type.Boolean({ default: false })
	export const deprecated = Type.Boolean({ default: false })
}

declare module '@sinclair/typebox' {
	interface SchemaOptions {
		releaseStage?: Static<typeof Keywords.releaseStage>
		deprecated?: Static<typeof Keywords.deprecated>
		/** A less complex alternate version of the schema for use with code generation tools. */
		[Simplify]?: TSchema
		[JsonTypeDef]?: {
			/** JTD schema to override the automatic conversion. Schema metadata will automatically be inherited from the JSON schema. */
			schema?: TSchema & { [Kind]: `TypeDef:${string}` }
			/** If true, this schema will be ignored when generating JTD schema. */
			skip?: boolean
			metadata?: Metadata
		}
	}
	interface StringOptions extends SchemaOptions {
		i18n?: Static<typeof Keywords.i18n>
	}
}

declare global {
	interface ObjectConstructor {
		keys<T extends object>(object: T): (keyof T)[]
	}
}
