import { TypeCompiler } from '@sinclair/typebox/compiler'
import { DataswornSourceSchema } from '../../schema/Root.js'
import { DefsKey } from '../const.js'

// console.log(
// 	DataswornSource[defsKey].DelveSiteDomain.properties.features.allOf[1].items[9]
// )

const SourceValidator = TypeCompiler.Compile(
	DataswornSourceSchema,
	Object.values(DataswornSourceSchema[DefsKey])
)


export default SourceValidator
