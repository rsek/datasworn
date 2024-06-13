import type TypeId from '../IdElements/TypeId.js'
import type TypeNode from '../TypeNode.js'

import { validate as asset } from './Asset.js'
import { validate as move } from './Move.js'
import { validate as oracle_rollable } from './OracleRollable.js'
import { validate as oracle_collection } from './OracleCollection.js'

const Validators = {
	// asset,
	// move,
	oracle_rollable,
	oracle_collection
} as const satisfies Partial<{
	[K in TypeId.AnyPrimary]: (obj: TypeNode.ByType<K>) => boolean
}>

export default Validators
