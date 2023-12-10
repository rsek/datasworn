import { parseId } from './parseId.js'
import { getById } from './getById.js'
import type * as Types from '../types/Datasworn.js'

import fs from 'fs-extra/esm'
import { getByWildcardId } from './getByWildcardId.js'

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
