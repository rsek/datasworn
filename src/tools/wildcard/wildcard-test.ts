import picomatch from 'picomatch'
import {
	forEveryCollectionIn,
	forEveryCollectableIn
} from './forEachCollection.js'
import { Datasworn } from './wildcard-test.js'
import fs from 'fs-extra/esm'
import fs from 'fs-extra/esm'
import type * as Types from '../../types/Datasworn.js'
import type * as Types from '../../types/Datasworn.js'

const starforged = fs.readJSONSync(
	'./datasworn/starforged/starforged.json'
) as Types.RulesPackage
const classic = fs.readJSONSync(
	'./datasworn/classic/classic.json'
) as Types.RulesPackage
const delve = fs.readJSONSync(
	'./datasworn/delve/delve.json'
) as Types.RulesPackage

export const Datasworn = { starforged, classic, delve }

const oracleCollectionIds: string[] = []
const oracleRollableIds: string[] = []
Object.values(Datasworn).forEach((rulesPackage) => {
	if (rulesPackage.oracles) {
		forEveryCollectionIn(rulesPackage.oracles, (c) => {
			oracleCollectionIds.push(c.id)
			return true
		})
		forEveryCollectableIn(rulesPackage.oracles, (c) =>
			oracleRollableIds.push(c.id)
		)
	}
})
// console.log(oracleRollableIds)
const match = picomatch('*/oracles/**/peril')
const matchedIds = oracleRollableIds.filter((id) => match(id))
// oracleRollableIds.forEach((id) => {
// 	if (match(id)) console.log(id)
// })
console.log(matchedIds)
