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

const recursiveCollectionString =
	'starforged/oracle_collection/core' satisfies Strings.RecursiveCollectionId
const recursiveCollectableString =
	'starforged/oracle_rollable/core/action' satisfies Strings.RecursiveCollectableId
const nonRecursiveCollectionString =
	'starforged/move_category/combat' satisfies Strings.NonRecursiveCollectionId
const nonRecursiveCollectableString =
	'starforged/move/combat/strike' satisfies Strings.NonRecursiveCollectableId
const nonCollectableString =
	'starforged/truth/magic' satisfies Strings.NonCollectableId

const recursiveCollectableId = IdParser.fromString(recursiveCollectableString)

const nonRecursiveCollectionId = IdParser.fromString(
	nonRecursiveCollectionString
)
const recursiveCollectionId = IdParser.fromString(recursiveCollectionString)

const nonRecursiveCollectableId = IdParser.fromString(
	nonRecursiveCollectableString
)
const nonCollectableId = IdParser.fromString(nonCollectableString)

for (const id of [
	recursiveCollectableId,
	recursiveCollectionId,
	nonRecursiveCollectableId,
	nonRecursiveCollectionId,
	nonCollectableId
]) {
	console.log(id.toString(), '=>', id.toPath().join('.'))
	console.log(`Retrieved "${id.get()?.name}"`)
}
