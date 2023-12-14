import type * as Types from '../../types/Datasworn.js'

import fs from 'fs-extra/esm'
import { getObjectPaths } from '../getPaths.js'
import ObjectGlobber from '../ObjectGlobber.js'
import { IdParser as IdParser } from '../IdParser.js'
import { conditionalPickDeepSymbol } from 'type-fest/source/conditional-pick-deep.js'
import Log from '../../scripts/utils/Log.js'

const starforged = fs.readJSONSync(
	'./datasworn/starforged/starforged.json'
) as Types.RulesPackage
const classic = fs.readJSONSync(
	'./datasworn/classic/classic.json'
) as Types.RulesPackage
const delve = fs.readJSONSync(
	'./datasworn/delve/delve.json'
) as Types.RulesPackage

IdParser.datasworn = { starforged, classic, delve } as any

// console.log(getByWildcardId('*/collections/moves/combat', Datasworn))

// console.log(getByWildcardId('*/moves/combat/*', Datasworn))

// console.log(getByWildcardId('*/assets/companion/*', Datasworn))

// console.log(getByWildcardId('starforged/collections/oracles/**', Datasworn))

// console.log(getObjectPaths(Datasworn))

// TODO: is there a globbing algorithm that can look *just* at paths to figure this shit out?

// from picomatch's docs, it can do the trick. it's just the matching behavior, not the filesystem interaction

// that would mean having an index of all ID objects and iterating over all IDs, though, rather than the current "walk" strategy
// could be a good way to check if recursive ones are matches, though? hmm...

// const wildcardPath = Path.fromId()
const testCollection = new IdParser('*/collections/oracles/**')
const testOracle = new IdParser('*/oracles/**/*')

// console.log(new Id('starforged/collections/oracles/**'))

// console.log(Id.getMatches('starforged/collections/oracles/*'))
// console.log(wildcardId.getMatches(Id.datasworn).map(({ id }) => id))
Log.info(testCollection.getMatches().map(({ id }) => id))
