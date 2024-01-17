import type * as Strings from './Strings.js'
import { IdParser } from '../IdParser.js'

const recursiveCollectionId =
	'sundered_isles/collections/oracles/core' satisfies Strings.RecursiveCollectionId
const recursiveCollectableId =
	'sundered_isles/oracles/core/action' satisfies Strings.RecursiveCollectableId
const nonRecursiveCollectionId =
	'starforged/collections/moves/combat' satisfies Strings.NonRecursiveCollectionId
const nonRecursiveCollectableId =
	'starforged/moves/combat/strike' satisfies Strings.NonRecursiveCollectableId
const nonCollectableId =
	'delve/site_themes/hallowed' satisfies Strings.NonCollectableId
const testParse = [
	IdParser.from(recursiveCollectableId),
	IdParser.from(nonRecursiveCollectionId),
	IdParser.from(recursiveCollectionId),
	IdParser.from(nonRecursiveCollectableId),
	IdParser.from(nonCollectableId)
]

for (const id of testParse) console.log(id.toString(), id.toPath().join('.'))

