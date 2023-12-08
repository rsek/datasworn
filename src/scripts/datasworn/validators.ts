import { TypeCompiler } from '@sinclair/typebox/compiler'
import * as Generic from '../../schema/Generic.js'
import { Dictionary } from '../../schema/Generic.js'
import * as Utils from '../../schema/Utils.js'
import { Localize, Metadata } from '../../schema/common/index.js'

/** Type validators */
namespace Assert {
	const commonRefs = [...Object.values(Localize), ...Object.values(Metadata)]

	const sourcedNodeValidatorSchema = Utils.OmitOptional(
		Generic.SourcedNodeBase,
		{
			additionalProperties: true
		}
	)

	export const SourcedNodeDictionary = TypeCompiler.Compile(
		Dictionary(sourcedNodeValidatorSchema),
		commonRefs
	)

	export const SourcedNode = TypeCompiler.Compile(
		sourcedNodeValidatorSchema,
		commonRefs
	)
}

export default Assert
