/**
 * A very lazy test script. If TS complains about TypeErrors in here, then something is broken!
 */

import type * as Strings from './StringId.js'
import { IdParser } from './IdParser.js'
// import { readFileSync } from 'fs'

// const path = './datasworn/starforged/starforged.json'

// IdParser.datasworn = {
// 	starforged: JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
// }

const collectionString =
	'oracle_collection:starforged/core' satisfies Strings.CollectionId
const collectableString =
	'oracle_rollable:starforged/core/action' satisfies Strings.CollectableId
const nonCollectableString =
	'truth:starforged/magic' satisfies Strings.NonCollectableId

const recursiveCollectableId = IdParser.parse(collectableString)

const recursiveCollectionId = IdParser.parse(collectionString)

const nonCollectableId = IdParser.parse(nonCollectableString)

for (const id of [
	recursiveCollectableId,
	recursiveCollectionId,
	nonCollectableId
]) {
	console.log(id.id, '=>', id.toGlobberPath().join('.'))
	// console.log(`Retrieved "${id.get()?.name}"`)
}
