"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeExpansion = mergeExpansion;
const CONST_js_1 = require("./IdElements/CONST.js");
const index_js_1 = require("./index.js");
const TypeId_js_1 = __importDefault(require("./IdElements/TypeId.js"));
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
function enhanceCollection(target, source) {
    const err = new Error(`Expected source <${source._id}> "${CONST_js_1.EnhancesKey}" property to include a wildcard matching target <${target._id}>, but got ${JSON.stringify(source[CONST_js_1.EnhancesKey])}.`);
    if (!(CONST_js_1.EnhancesKey in source))
        throw err;
    if (!Array.isArray(source[CONST_js_1.EnhancesKey]))
        throw err;
    const targetId = index_js_1.IdParser.parse(target._id);
    if (!targetId.isMatchedBy(...source[CONST_js_1.EnhancesKey]))
        throw err;
    target[CONST_js_1.ContentsKey] = applyDictionaryReplacements(target[CONST_js_1.ContentsKey], source[CONST_js_1.ContentsKey]);
    target[CONST_js_1.CollectionsKey] = applyDictionaryEnhancements(target[CONST_js_1.CollectionsKey], source[CONST_js_1.CollectionsKey]);
    return target;
}
function applyDictionaryEnhancements(targetDictionary, sourceDictionary) {
    const targetMap = targetDictionary instanceof Map
        ? targetDictionary
        : new Map(Object.entries(targetDictionary));
    const sourceMap = sourceDictionary instanceof Map
        ? sourceDictionary
        : new Map(Object.entries(sourceDictionary));
    for (const [key, source] of sourceMap) {
        if (!targetMap.has(key)) {
            targetMap.set(key, source);
            continue;
        }
        if (!(CONST_js_1.EnhancesKey in source))
            continue;
        const target = targetMap.get(key);
        targetMap.set(key, enhanceCollection(target, source));
    }
    const result = targetDictionary instanceof Map ? targetMap : Object.fromEntries(targetMap);
    return result;
}
function applyDictionaryReplacements(targetDictionary, sourceDictionary) {
    const targetMap = targetDictionary instanceof Map
        ? targetDictionary
        : new Map(Object.entries(targetDictionary));
    const sourceMap = sourceDictionary instanceof Map
        ? sourceDictionary
        : new Map(Object.entries(sourceDictionary));
    for (const [key, source] of sourceMap) {
        if (!targetMap.has(key)) {
            targetMap.set(key, source);
            continue;
        }
        if (!(CONST_js_1.ReplacesKey in source))
            continue;
        const target = targetMap.get(key);
        const err = new Error(`Expected source <${source._id}> "${CONST_js_1.ReplacesKey}" property to include a wildcard matching target <${target._id}>, but got ${JSON.stringify(source[CONST_js_1.ReplacesKey])}`);
        if (!(CONST_js_1.ReplacesKey in source))
            throw err;
        if (!Array.isArray(source[CONST_js_1.ReplacesKey]))
            throw err;
        const targetValueId = index_js_1.IdParser.parse(target._id);
        if (!targetValueId.isMatchedBy(...source[CONST_js_1.ReplacesKey]))
            throw err;
        targetMap.set(key, source);
    }
    const result = targetDictionary instanceof Map ? targetMap : Object.fromEntries(targetMap);
    return result;
}
function mergeExpansion(ruleset, expansion, strict = true) {
    if (strict && ruleset._id !== expansion.ruleset)
        throw new Error(`Can only merge to the expansion's matching ruleset "${expansion.ruleset}" in strict mode, but got ruleset "${ruleset._id}".`);
    // apply noncollectable merges
    // const nonCollectables = TypeId.NonCollectable.map(TypeId.getBranchKey)
    const collections = TypeId_js_1.default.Collectable.map(TypeId_js_1.default.getBranchKey);
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
        if (!(branchKey in expansion))
            continue;
        const expansionBranch = expansion[branchKey];
        if (!(branchKey in ruleset))
            // @ts-expect-error
            ruleset[branchKey] = expansionBranch;
        else {
            const rulesetBranch = ruleset[branchKey];
            if (expansionBranch && typeof expansionBranch === 'object' && CONST_js_1.ReplacesKey in expansionBranch) {
                // @ts-expect-error
                ruleset[branchKey] = applyDictionaryReplacements(rulesetBranch, expansionBranch);
            }
            else {
                // @ts-expect-error
                ruleset[branchKey] = applyDictionaryEnhancements(rulesetBranch, expansionBranch);
            }
        }
    }
    return ruleset;
}
