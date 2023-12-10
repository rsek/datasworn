import { parseId } from './parseId.js'
import { getById } from './getById.js'
import type * as Types from '../types/Datasworn.js'

import fs from 'fs-extra/esm'
import { getByWildcardId } from './getByWildcardId.js'
import FastGlob from 'fast-glob'

const starforged = fs.readJSONSync(
	'./datasworn/starforged/starforged.json'
) as Types.RulesPackage
const classic = fs.readJSONSync(
	'./datasworn/classic/classic.json'
) as Types.RulesPackage
const delve = fs.readJSONSync(
	'./datasworn/delve/delve.json'
) as Types.RulesPackage

const Datasworn = { starforged, classic, delve }

// console.log(getByWildcardId('*/collections/moves/combat', Datasworn))

// console.log(getByWildcardId('*/moves/combat/*', Datasworn))

console.log(getByWildcardId('*/assets/companion/*', Datasworn))

// TODO: is there a globbing algorithm that can look *just* at paths to figure this shit out?

// from picomatch's docs, it can do the trick. it's just the matching behavior, not the filesystem interaction

// that would mean having an index of all ID objects and iterating over all IDs, though, rather than the current "walk" strategy
// could be a good way to check if recursive ones are matches, though? hmm...