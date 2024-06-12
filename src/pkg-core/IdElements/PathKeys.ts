import type { DictKey } from '../Datasworn.js'
import type { TupleOfLength } from '../Utils/Array.js'
import { type CONST } from './index.js'
import { type Range } from '../Utils/Number.js'

export type CollectionAncestorKeys =
	| TupleOfLength<CollectionAncestorsLength, DictKey>
	| []
export type CollectionPathKeys = [...CollectionAncestorKeys, DictKey]
export type CollectableAncestorKeys = CollectionPathKeys
export type CollectablePathKeys = [...CollectableAncestorKeys, DictKey]

export type NonCollectablePathKeys = [DictKey]
type CollectionPathLength =
	| CONST.RECURSIVE_PATH_ELEMENTS_MIN
	| Range<CONST.RECURSIVE_PATH_ELEMENTS_MIN, CONST.RECURSIVE_PATH_ELEMENTS_MAX>
	| CONST.RECURSIVE_PATH_ELEMENTS_MAX

export type CollectionAncestorsLength =
	| 0
	| Range<CONST.RECURSIVE_PATH_ELEMENTS_MIN, CONST.RECURSIVE_PATH_ELEMENTS_MAX>