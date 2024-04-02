"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceCollection = void 0;
// const classic = fs.readJSONSync(
// 	'./pkg/nodejs/@datasworn/ironsworn-classic/json/classic.json'
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
 * Mutates `target`.
 * @param target The collection object to be enhanced.
 * @param source The changes to be applied to `target`
 * @param strictOverrides Should enhancements to collections and collectables require a matching `enhances` or `overrides` property? (default: `true`)
 */
function enhanceCollection(target, source, strictOverrides = true) {
    if (strictOverrides &&
        !('enhances' in source && String(source.enhances) === String(target._id)))
        throw new Error('strict mode requires a `enhances` property in the parameter `source`; its value must match the ID of the collection being enhanced.');
    // no changes to make -- skip
    if (source === undefined ||
        source === null ||
        Object.keys(source).length === 0)
        return target;
    // no existing data to worry about -- overwrite it
    if (target === undefined ||
        target === null ||
        Object.keys(target).length === 0)
        return Object.assign(target, source);
    for (const key in source) {
        const newValue = source[key];
        const oldValue = target[key];
        // skip if there's nothing to add
        if (newValue === undefined ||
            newValue === null ||
            (newValue instanceof Map && newValue.size === 0) ||
            Object.keys(newValue).length === 0)
            continue;
        // automatically override the original value if it's empty
        if (oldValue === undefined ||
            oldValue === null ||
            (oldValue instanceof Map && oldValue.size === 0) ||
            Object.keys(oldValue).length === 0) {
            target[key] = newValue;
            continue;
        }
        switch (key) {
            // IDs should never be overwritten -- they need to relate to the object's 'real' position or the id lookup won't work.
            case '_id':
            case 'enhances':
            case 'replaces':
                // these metadata shouldn't be replicated on the merged tree
                continue;
            case 'contents':
                {
                    const sourceChildren = newValue instanceof Map ? newValue : Object.entries(newValue);
                    for (const [childKey, sourceChild] of sourceChildren) {
                        if (sourceChild == null)
                            continue;
                        const oldChild = oldValue instanceof Map
                            ? oldValue.get(childKey)
                            : oldValue[childKey];
                        const locationId = oldChild == null
                            ? target._id.replace('/collections/', '/') + `/${childKey}`
                            : String(oldChild._id);
                        const srcId = sourceChild._id;
                        const updatedChild = oldChild == null
                            ? sourceChild
                            : Object.assign(oldChild, sourceChild);
                        updatedChild._id = locationId;
                        if (oldChild == null)
                            updatedChild._inserted_by = srcId;
                        else
                            updatedChild._replaced_by = srcId;
                        if (oldValue instanceof Map)
                            oldValue.set(childKey, updatedChild);
                        else
                            oldValue[childKey] = updatedChild;
                    }
                }
                break;
            case 'collections': {
                // child collections are enhanced recursively
                const sourceChildren = newValue instanceof Map ? newValue : Object.entries(newValue);
                for (const [childKey, sourceChild] of sourceChildren) {
                    if (oldValue instanceof Map) {
                        const updatedChild = oldValue.has(childKey)
                            ? enhanceCollection(oldValue.get(childKey), sourceChild, strictOverrides)
                            : sourceChild;
                        oldValue.set(childKey, updatedChild);
                    }
                    else {
                        const updatedChild = childKey in oldValue
                            ? enhanceCollection(oldValue[childKey], sourceChild, strictOverrides)
                            : sourceChild;
                        oldValue[childKey] = updatedChild;
                    }
                }
                break;
            }
            default:
                target[key] = newValue;
                break;
        }
    }
    return target;
}
exports.enhanceCollection = enhanceCollection;
