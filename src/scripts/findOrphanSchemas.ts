import fs from 'fs-extra'

const usedSchemas = new Set<string>()
const schemaIds = new Set<string>()

const data = await fs.readJson('datasworn/datasworn.schema.json', {
	reviver(key, value) {
		if (key === 'definitions' && typeof value === 'object')
			for (const schemaId in value) schemaIds.add(schemaId)
		if (key === '$ref' && typeof value === 'string')
			usedSchemas.add(value.split('/').pop() as string)
		return value
	}
})

const unusedSchemas = new Set<string>()

for (const schemaId of schemaIds)
	if (!usedSchemas.has(schemaId)) unusedSchemas.add(schemaId)
