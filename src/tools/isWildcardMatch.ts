import picomatch from 'picomatch'

export function isWildcardMatch(id: string, wildcardId: string) {}

const match = picomatch('*/oracles/**/(peril/*|peril)')

const testIds = [
	'starforged/oracles/planets/peril/lifebearing',
	'starforged/oracles/space/peril'
]

for (const id of testIds) {
	console.log(id, match(id))
}

// TODO: prob want to walk until we encounter a wildcard element
