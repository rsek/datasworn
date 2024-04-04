import { TypeCompiler } from '@sinclair/typebox/compiler'
import { DataswornSchema } from '../../schema/Root.js'
import { type TSchema } from '@sinclair/typebox'
import { DefsKey } from '../const.js'

const { $schema, $id, [DefsKey]: defs, ...root } = DataswornSchema

const OutputValidator = TypeCompiler.Compile(
	root as TSchema,
	Object.values(defs)
)

export default OutputValidator

