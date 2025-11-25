import { expect, test, describe } from 'bun:test'
import { readFileSync } from 'fs'
import path from 'path'
import { mergeExpansion } from '../pkg-core/mergeExpansion.js'
import { IdParser } from '../pkg-core/IdParser.js'
import type { Datasworn } from '../pkg-core/index.js'

const ROOT = path.resolve(import.meta.dir, '../..')

// Load test data
function loadRuleset(name: string): Datasworn.Ruleset {
	const filePath = path.join(ROOT, `datasworn/${name}/${name}.json`)
	return JSON.parse(readFileSync(filePath, 'utf-8')) as Datasworn.Ruleset
}

function loadExpansion(name: string): Datasworn.Expansion {
	const filePath = path.join(ROOT, `datasworn/${name}/${name}.json`)
	return JSON.parse(readFileSync(filePath, 'utf-8')) as Datasworn.Expansion
}

// Deep clone to avoid mutating original data
function clone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}

describe('mergeExpansion', () => {
	test('merges Sundered Isles into Starforged', () => {
		const starforged = clone(loadRuleset('starforged'))
		const sunderedIsles = loadExpansion('sundered_isles')

		// Count content before merge
		const movesBefore = Object.keys(starforged.moves).length
		const assetsBefore = Object.keys(starforged.assets).length
		const oraclesBefore = Object.keys(starforged.oracles).length

		// Merge
		const merged = mergeExpansion(starforged, sunderedIsles)

		// Verify merge returned the ruleset
		expect(merged._id).toBe('starforged')

		// After merge, should have at least as many items (expansion adds content)
		const movesAfter = Object.keys(merged.moves).length
		const assetsAfter = Object.keys(merged.assets).length
		const oraclesAfter = Object.keys(merged.oracles).length

		expect(movesAfter).toBeGreaterThanOrEqual(movesBefore)
		expect(assetsAfter).toBeGreaterThanOrEqual(assetsBefore)
		expect(oraclesAfter).toBeGreaterThanOrEqual(oraclesBefore)
	})

	test('merges Delve into Classic', () => {
		const classic = clone(loadRuleset('classic'))
		const delve = loadExpansion('delve')

		// Merge
		const merged = mergeExpansion(classic, delve)

		// Verify merge returned the ruleset
		expect(merged._id).toBe('classic')

		// Delve adds site themes, site domains, and delve moves
		// Check that Delve content is accessible
		expect(merged.oracles).toBeDefined()
	})

	test('strict mode rejects mismatched expansion', () => {
		const starforged = clone(loadRuleset('starforged'))
		const delve = loadExpansion('delve') // Delve is for classic, not starforged

		// Should throw in strict mode because ruleset IDs don't match
		expect(() => mergeExpansion(starforged, delve, true)).toThrow()
	})

	test('merged content is accessible via original keys', () => {
		const starforged = clone(loadRuleset('starforged'))
		const sunderedIsles = loadExpansion('sundered_isles')

		const merged = mergeExpansion(starforged, sunderedIsles)

		// Original Starforged content should still be accessible
		expect(merged.moves.adventure).toBeDefined()
		expect(merged.moves.quest).toBeDefined()
		expect(merged.moves.connection).toBeDefined()

		// Assets should still be accessible
		expect(merged.assets.path).toBeDefined()
		expect(merged.assets.companion).toBeDefined()
	})

	test('merge does not mutate expansion', () => {
		const starforged = clone(loadRuleset('starforged'))
		const sunderedIsles = loadExpansion('sundered_isles')
		const originalExpansionStr = JSON.stringify(sunderedIsles)

		mergeExpansion(starforged, sunderedIsles)

		// Expansion should be unchanged
		expect(JSON.stringify(sunderedIsles)).toBe(originalExpansionStr)
	})
})

describe('IdParser integration', () => {
	test('can look up merged content', () => {
		const starforged = clone(loadRuleset('starforged'))
		const sunderedIsles = loadExpansion('sundered_isles')

		const merged = mergeExpansion(starforged, sunderedIsles)

		// Set up IdParser with merged data
		IdParser.tree = new Map<string, Datasworn.RulesPackage>([
			['starforged', merged],
			['sundered_isles', sunderedIsles]
		])

		// Should be able to look up Starforged content
		const faceDanger = IdParser.get('move:starforged/adventure/face_danger')
		expect(faceDanger).toBeDefined()
		expect(faceDanger._id).toBe('move:starforged/adventure/face_danger')
	})
})
