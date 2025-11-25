import {
	EnhancesKey,
	ContentsKey,
	CollectionsKey,
	ReplacesKey
} from './IdElements/CONST.js'
import type TypeNode from './TypeNode.js'
import { IdParser } from './index.js'
// import fs from 'fs-extra'
import type { Datasworn } from './index.js'
import TypeId from './IdElements/TypeId.js'

// const classic = fs.readJSONSync(
// 	'./pkg/nodejs/@datasworn/ironsworn-classic/json/classic.json'
// ) as Datasworn.Ruleset

// const starforged = fs.readJSONSync(
// 	'./pkg/nodejs/@datasworn/starforged/json/starforged.json'
// ) as Datasworn.Ruleset

// const sundered_isles = fs.readJSONSync(
// 	'./pkg/nodejs/@datasworn/sundered-isles/json/sundered_isles.json'
// ) as Datasworn.Expansion

// const delve = fs.readJSONSync(
// 	'./pkg/nodejs/@datasworn/ironsworn-classic-delve/json/delve.json'
// ) as Datasworn.Expansion

// const mergedClassic = mergeExpansion(classic, delve)

// console.log(mergedClassic.oracles.character)

// const mergedStarforged = mergeExpansion(starforged, sundered_isles)

// console.log(mergedStarforged)

// IdParser.tree = new Map(
// 	[classic, starforged, sundered_isles, delve].map((pkg) => [pkg._id, pkg])
// )

// const collectionId = IdParser.parse('oracle_collection:sundered_isles/**')
// const collectableId = IdParser.parse('oracle_rollable:*/**/peril')

// const collectionResults = Array.from(collectionId.getMatches().keys())
// const collectableResults = Array.from(collectableId.getMatches().keys())

// console.log(collectionResults)
// console.log(collectableResults)

// const f = IdParser.parse('move_category:classic/suffer')

// const fff = IdParser.parse('move:classic/suffer/endure_stress')

// console.log(f)
// console.log(fff)

// console.log(fff._getUnsafe())

// ) as Datasworn.Ruleset
// const delve = fs.readJSONSync(
// 	'./pkg/nodejs/@datasworn/ironsworn-classic-delve/json/delve.json'
// ) as Datasworn.RulesPackage

// for (const [k, v] of Object.entries(delve.oracles)) {
// 	const updatedCollection =
// 		k in classic.oracles ? enhanceCollection(classic.oracles[k], v) : v
// 	classic.oracles[k] = updatedCollection
// }

// console.log(classic.oracles.character)

/**
 * Applies overrides to Datasworn collection from another Datasworn collection.
 * Mutates `target`.
 * @param target The collection object to be enhanced.
 * @param source The changes to be applied to `target`
 * @returns The mutated `target`
 * @throws If the `source` is missing a matching wildcardId.
 * @experimental
 */
function enhanceCollection<T extends TypeNode.Collection>(
	target: T,
	source: T
): T {
	const err = new Error(
		`Expected source <${source._id}> "${EnhancesKey}" property to include a wildcard matching target <${target._id}>, but got ${JSON.stringify(source[EnhancesKey])}.`
	)
	if (!(EnhancesKey in source)) throw err
	if (!Array.isArray(source[EnhancesKey])) throw err

	const targetId = IdParser.parse(target._id)

	if (!targetId.isMatchedBy(...source[EnhancesKey])) throw err
	target[ContentsKey] = applyDictionaryReplacements(
		target[ContentsKey],
		source[ContentsKey]
	)

	;(target as unknown as Record<string, unknown>)[CollectionsKey] = applyDictionaryEnhancements(
		(target as unknown as Record<string, unknown>)[CollectionsKey] as Record<string, T>,
		(source as unknown as Record<string, unknown>)[CollectionsKey] as Record<string, T>
	)

	return target
}

function applyDictionaryEnhancements<
	T extends TypeNode.Collection,
	TTarget extends Map<string, T> | Record<string, T>,
	TSource extends Map<string, T> | Record<string, T>
>(targetDictionary: TTarget, sourceDictionary: TSource) {
	const targetMap: Map<string, T> =
		targetDictionary instanceof Map
			? targetDictionary
			: new Map(Object.entries(targetDictionary))
	const sourceMap: Map<string, T> =
		sourceDictionary instanceof Map
			? sourceDictionary
			: new Map(Object.entries(sourceDictionary))

	for (const [key, source] of sourceMap) {
		if (!targetMap.has(key)) {
			targetMap.set(key, source)
			continue
		}

		if (!(EnhancesKey in source)) continue

		const target = targetMap.get(key) as T

		targetMap.set(key, enhanceCollection(target, source))
	}

	const result =
		targetDictionary instanceof Map ? targetMap : Object.fromEntries(targetMap)

	return result as TTarget
}

function applyDictionaryReplacements<
	T extends
		| TypeNode.Collectable
		| TypeNode.NonCollectable
		| TypeNode.Collection,
	TTarget extends Map<string, T> | Record<string, T>,
	TSource extends Map<string, T> | Record<string, T>
>(targetDictionary: TTarget, sourceDictionary: TSource) {
	const targetMap: Map<string, T> =
		targetDictionary instanceof Map
			? targetDictionary
			: new Map(Object.entries(targetDictionary))
	const sourceMap: Map<string, T> =
		sourceDictionary instanceof Map
			? sourceDictionary
			: new Map(Object.entries(sourceDictionary))

	for (const [key, source] of sourceMap) {
		if (!targetMap.has(key)) {
			targetMap.set(key, source)
			continue
		}

		if (!(ReplacesKey in source)) continue

		const target = targetMap.get(key) as T

		const err = new Error(
			`Expected source <${source._id}> "${ReplacesKey}" property to include a wildcard matching target <${target._id}>, but got ${JSON.stringify(source[ReplacesKey])}`
		)
		if (!(ReplacesKey in source)) throw err
		if (!Array.isArray(source[ReplacesKey])) throw err

		const targetValueId = IdParser.parse(target._id)

		if (!targetValueId.isMatchedBy(...source[ReplacesKey])) throw err

		targetMap.set(key, source)
	}

	const result =
		targetDictionary instanceof Map ? targetMap : Object.fromEntries(targetMap)

	return result as TTarget
}

export function mergeExpansion(
	ruleset: Datasworn.Ruleset,
	expansion: Datasworn.Expansion,
	strict = true
) {
	if (strict && ruleset._id !== expansion.ruleset)
		throw new Error(
			`Can only merge to the expansion's matching ruleset "${expansion.ruleset}" in strict mode, but got ruleset "${ruleset._id}".`
		)

	// apply noncollectable merges
	// const nonCollectables = TypeId.NonCollectable.map(TypeId.getBranchKey)
	const collections = TypeId.Collectable.map(TypeId.getBranchKey)

	// for (const branchKey of nonCollectables) {
	// 	if (!(branchKey in expansion)) continue

	// 	if (!(branchKey in ruleset))
	// 		// @ts-expect-error
	// 		ruleset[branchKey] = expansion[branchKey]
	// 	else {
	// 		// @ts-expect-error
	// 		ruleset[branchKey] = applyDictionaryReplacements(
	// 			ruleset[branchKey],
	// 			expansion[branchKey],
	// 			strict
	// 		)
	// 	}
	// }

	for (const branchKey of collections) {
		if (!(branchKey in expansion)) continue
		const expansionBranch = (expansion as unknown as Record<string, unknown>)[branchKey]
		if (!(branchKey in ruleset))
			// @ts-expect-error
			ruleset[branchKey] = expansionBranch
		else {
			const rulesetBranch = (ruleset as unknown as Record<string, unknown>)[branchKey]
			if (expansionBranch && typeof expansionBranch === 'object' && ReplacesKey in expansionBranch) {
				// @ts-expect-error
				ruleset[branchKey] = applyDictionaryReplacements(
					rulesetBranch as Record<string, TypeNode.Collection>,
					expansionBranch as Record<string, TypeNode.Collection>
				)
			} else {
				// @ts-expect-error
				ruleset[branchKey] = applyDictionaryEnhancements(
					rulesetBranch as Record<string, TypeNode.Collection>,
					expansionBranch as Record<string, TypeNode.Collection>
				)
			}
		}
	}

	return ruleset
}
