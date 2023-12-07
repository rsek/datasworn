import { Type } from '@sinclair/typebox'
import { UnionEnum } from '../schema/datasworn/Utils.js'

export namespace Keywords {
	export const releaseStage = UnionEnum(
		['unstable', 'experimental', 'release'],
		{
			default: 'release'
		}
	)
	export const i18n = Type.Boolean({ default: false })
}

declare module '@sinclair/typebox' {
	interface SchemaOptions {
		releaseStage?: Static<typeof Keywords.releaseStage>
	}
	interface StringOptions extends SchemaOptions {
		i18n?: Static<typeof Keywords.i18n>
	}
}
