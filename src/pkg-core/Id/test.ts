import type * as Strings from './Strings.js'
import { IdParser } from '../IdParser.js'

const recursiveCollectionString =
	'sundered_isles/collections/oracles/core' satisfies Strings.RecursiveCollectionId
const recursiveCollectableString =
	'sundered_isles/oracles/core/action' satisfies Strings.RecursiveCollectableId
const nonRecursiveCollectionString =
	'starforged/collections/moves/combat' satisfies Strings.NonRecursiveCollectionId
const nonRecursiveCollectableString =
	'starforged/moves/combat/strike' satisfies Strings.NonRecursiveCollectableId
const nonCollectableString =
	'delve/site_themes/hallowed' satisfies Strings.NonCollectableId

const recursiveCollectableId = IdParser.from(recursiveCollectableString)

const nonRecursiveCollectionId = IdParser.from(nonRecursiveCollectionString)
const recursiveCollectionId = IdParser.from(recursiveCollectionString)

const nonRecursiveCollectableId = IdParser.from(nonRecursiveCollectableString)
const nonCollectableId = IdParser.from(nonCollectableString)

for (const id of [
	recursiveCollectableId,
	recursiveCollectionId,
	nonRecursiveCollectableId,
	nonRecursiveCollectionId,
	nonCollectableId
])
	console.log(id.toString(), id.toPath().join('.'))
