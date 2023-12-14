import Log from '../scripts/utils/Log.js'
import { IdParser } from './IdParser.js'

const ids = [
	'starforged/oracles/core/action',
	'starforged/oracles/character/names/given',
	'starforged/oracles/planets/furnace/settlements/terminus',
	'starforged/oracles1/planets'
] as const

for (const id of ids) {
	try {
		const parsed = new IdParser(id as any)
		console.log(parsed)
		console.log(id === parsed.toString())
	} catch (err) {
		Log.error(err)
	}
}
