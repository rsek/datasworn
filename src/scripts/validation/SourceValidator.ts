import { TypeCompiler } from '@sinclair/typebox/compiler'
import { DataswornSourceRoot } from '../../schema/datasworn/Root.js'
import { defsKey } from '../const.js'

// console.log(
// 	DataswornSource[defsKey].DelveSiteDomain.properties.features.allOf[1].items[9]
// )

const SourceValidator = TypeCompiler.Compile(
	DataswornSourceRoot,
	Object.values(DataswornSourceRoot[defsKey])
)


export default SourceValidator
