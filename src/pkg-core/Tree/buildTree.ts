import type * as Datasworn from '../Datasworn.js'
import { type DataswornTree } from '../Id/Utils.js'

/** Construct a complete Datasworn tree object from one or more deserialized JSON objects. */
export function buildTree(...rulesPackages: Datasworn.RulesPackage[]) {
	const tree: DataswornTree = {}

	for (const rulesPackage of rulesPackages) tree[rulesPackage.id] = rulesPackage

	return tree
}

// const testDataRaw = { a: { aa: 1 }, b: { aa: 3 } }

// const testData = new Map(Object.entries(testDataRaw))

// console.log(testDataRaw)

// console.log(ObjectGlobber.getObjectPaths(testDataRaw))
// console.log(ObjectGlobber.getObjectPaths(testData))

// console.log(ObjectGlobber.getKeyMatches(testData, '*'))

// console.log(testData)
