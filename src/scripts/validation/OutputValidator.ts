import { TypeCompiler } from '@sinclair/typebox/compiler'
import { DataswornRoot } from '../../schema/Root.js'
import { type TSchema } from '@sinclair/typebox'
import { defsKey } from '../const.js'

const { $schema, $id, [defsKey]: defs, ...root } = DataswornRoot

const OutputValidator = TypeCompiler.Compile(
	root as TSchema,
	Object.values(defs)
)

export default OutputValidator

