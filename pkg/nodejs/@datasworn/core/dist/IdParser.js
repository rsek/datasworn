"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _IdParser_pathSegments, _IdParser_typeIds, _IdParser_validateEmbeddedTypeIdChain, _IdParser_validateTypeIds, _IdParser_toString, _IdParser_parseOptions, _IdParser_getClassForPrimaryTypeId, _IdParser_getPathKeyCount, _IdParser_getMatchesFromArray, _IdParser_getMatchesFromMap, _IdParser_getMatchesFromRecord, _EmbeddingId_instances, _EmbeddingId_assignEmbeddedIdsInMap, _EmbeddingId_assignEmbeddedIdsInRecord, _EmbeddingId_assignEmbeddedIdsInArray, _EmbeddedId_parent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonCollectableId = exports.IdParser = exports.EmbeddedId = exports.CollectionId = exports.CollectableId = void 0;
const CONST_js_1 = __importDefault(require("./IdElements/CONST.js"));
const TypeGuard_js_1 = __importDefault(require("./IdElements/TypeGuard.js"));
const TypeId_js_1 = __importDefault(require("./IdElements/TypeId.js"));
const Errors_js_1 = require("./Errors.js");
const index_js_1 = require("./IdElements/index.js");
class IdParser {
    get typeIds() {
        return __classPrivateFieldGet(this, _IdParser_typeIds, "f");
    }
    set typeIds(value) {
        __classPrivateFieldGet(_a, _a, "m", _IdParser_validateTypeIds).call(_a, value);
        __classPrivateFieldSet(this, _IdParser_typeIds, value, "f");
    }
    get pathSegments() {
        return __classPrivateFieldGet(this, _IdParser_pathSegments, "f");
    }
    set pathSegments(value) {
        _a._validatePathSegments(this.typeIds, value);
        __classPrivateFieldSet(this, _IdParser_pathSegments, value, "f");
    }
    /**
     * This node's ancestor key on {@link Datasworn.RulesPackage}.
     */
    get typeBranchKey() {
        return TypeId_js_1.default.getBranchKey(this.primaryTypeId);
    }
    constructor(options) {
        _IdParser_pathSegments.set(this, void 0);
        _IdParser_typeIds.set(this, void 0);
        // prepare the ID so we can throw errors with it if necessary
        const id = __classPrivateFieldGet(_a, _a, "m", _IdParser_toString).call(_a, options);
        const { typeIds, pathSegments } = options;
        const errors = [];
        try {
            this.typeIds = typeIds;
            this.pathSegments = pathSegments;
        }
        catch (e) {
            errors.push(e);
        }
        if (errors.length > 0)
            throw new Errors_js_1.ParseError(id, errors.join('\n'));
    }
    /**
     * Returns a string representation of the ID.
     */
    get id() {
        return __classPrivateFieldGet(_a, _a, "m", _IdParser_toString).call(_a, this);
    }
    toString() {
        return this.id;
    }
    // ID parts
    /** The type ID of the target node. */
    get typeId() {
        return this.typeIds.at(-1);
    }
    get primaryTypeId() {
        return this.typeIds[0];
    }
    get primaryPath() {
        return this.pathSegments[0];
    }
    get primaryPathKeys() {
        return this.primaryPath.split(CONST_js_1.default.PathKeySep);
    }
    /** The ID of the {@link RulesPackage} that contains this ID, or a wildcard to represent any RulesPackage. */
    get rulesPackageId() {
        return this.primaryPathKeys[0];
    }
    get primaryPathKeysWithinPkg() {
        // omit rules package, which is the first
        const [_rulesPackage, ...keyElements] = this.primaryPathKeys;
        return keyElements;
    }
    get fullTypeId() {
        return this.typeIds.join(CONST_js_1.default.TypeSep);
    }
    get fullPath() {
        return this.pathSegments.join(CONST_js_1.default.TypeSep);
    }
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard() {
        return this.id.includes(CONST_js_1.default.WildcardString);
    }
    get embedTypes() {
        return TypeId_js_1.default.getEmbeddableTypes(this.typeId, this instanceof EmbeddedId);
    }
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is a wildcard ID. If no Datasworn tree is provided (either in {@link IdParser.tree} or as an argument).
     * @returns The identified node, or `undefined` if the node doesn't exist.
     */
    get(tree = _a.tree) {
        if (tree == null)
            throw new Error(`No Datasworn tree found -- set the static property ${_a.constructor.name}#tree, or provide one as a parameter.`);
        if (this.isWildcard)
            throw new Error(`${this.constructor.name}#${this.get.name} expected a non-wildcard ID, but got <${this.id}>. If you want to get wildcard matches, use ${this.constructor.name}#${this.getMatches.name} instead.`);
        try {
            return this._getUnsafe(tree);
        }
        catch (e) {
            return undefined;
        }
    }
    /**
     * Get all Datasworn nodes that match this wildcard ID.
     * @remarks Non-wildcard IDs work here too; technically they're valid as wildcard IDs.
     * @returns A {@link Map}
     */
    getMatches(tree = _a.tree) {
        // skip a bunch of iteration if it's not actually a wildcard ID
        if (!this.isWildcard) {
            const match = this.get(tree);
            const matches = new Map();
            if (match != null)
                matches.set(match._id, match);
            return matches;
        }
        return this._getMatchesUnsafe(tree);
    }
    /** Assign `_id` strings in a Datasworn node.
     * @param node The Datasworn
     * @param recursive Should IDs be assigned to descendant objects too? (default: true)
     * @param index A Map used to index items by their assigned ID.
     * @returns The mutated object.
     */
    assignIdsIn(node, recursive = true, index) {
        if (typeof node !== 'object' || node === null)
            throw new Error(`Expected a Datasworn node object, but got ${String(node)}`);
        if ('_id' in node && typeof node._id === 'string')
            _a.logger.warn(`Can't assign <${this.id}>, node already has <${node._id}>`);
        else {
            if (index instanceof Map && index.has(this.id))
                throw new Error(`Generated ID <${this.id}>, but it already exists in the index`);
            // @ts-expect-error
            node._id = this.id;
            if (index instanceof Map)
                index.set(this.id, node);
        }
        return node;
    }
    static get(id, tree = _a.datasworn) {
        const parsed = id instanceof _a ? id : _a.parse(id);
        return parsed.get(tree);
    }
    static getMatches(id, tree = _a.datasworn) {
        const parsed = id instanceof _a ? id : _a.parse(id);
        return parsed.getMatches(tree);
    }
    static parse(id) {
        const { typeIds, pathSegments } = __classPrivateFieldGet(this, _a, "m", _IdParser_parseOptions).call(this, id);
        const [primaryTypeId, ...embeddedTypeIds] = typeIds;
        const [primaryPath, ...embeddedPaths] = pathSegments;
        const [rulesPackage, ...pathKeys] = primaryPath.split(CONST_js_1.default.PathKeySep);
        const Ctor = __classPrivateFieldGet(_a, _a, "m", _IdParser_getClassForPrimaryTypeId).call(_a, primaryTypeId);
        // @ts-expect-error
        const base = new Ctor(primaryTypeId, rulesPackage, ...pathKeys);
        if (embeddedTypeIds.length === 0)
            return base;
        let lastParser = base;
        for (let i = 0; i < embeddedTypeIds.length; i++) {
            const typeId = embeddedTypeIds[i];
            const pathKey = embeddedPaths[i];
            lastParser = lastParser.createEmbeddedIdChild(typeId, pathKey);
        }
        return lastParser;
    }
    /**
     * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
     * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
     * @param index If provided, nodes that receive IDs will be indexed in the map (with their ID as the key).
     * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
     */
    static assignIdsInRulesPackage(rulesPackage, index) {
        const errorMessages = [];
        for (const typeId in TypeId_js_1.default.BranchKey) {
            const typeBranchKey = TypeId_js_1.default.getBranchKey(typeId);
            const typeBranch = rulesPackage[typeBranchKey];
            if (typeBranch == null)
                continue;
            for (const dictKey in typeBranch) {
                const node = typeBranch[dictKey];
                if (node == null)
                    continue;
                try {
                    switch (true) {
                        case TypeGuard_js_1.default.CollectionType(typeId):
                            new CollectionId(typeId, rulesPackage._id, dictKey).assignIdsIn(node, true, index);
                            break;
                        case TypeGuard_js_1.default.NonCollectableType(typeId):
                            new NonCollectableId(typeId, rulesPackage._id, dictKey).assignIdsIn(node, true, index);
                            break;
                    }
                }
                catch (e) {
                    const id = `${typeId}${CONST_js_1.default.PrefixSep}${rulesPackage._id}${CONST_js_1.default.PathKeySep}${dictKey}`;
                    errorMessages.push(`Failed to create ID within <${id}>. ${String(e)}`);
                }
            }
        }
        if (errorMessages.length > 0)
            throw new Error(errorMessages.join('\n'));
        // @ts-expect-error
        return rulesPackage;
    }
    static _validatePathSegments(typeIds, pathSegments) {
        if (!(Array.isArray(pathSegments) &&
            pathSegments.every((str) => typeof str === 'string')))
            throw new Error(`Expected an array of strings, but got ${JSON.stringify(pathSegments)}`);
        if (typeIds.length !== pathSegments.length)
            throw new Error(`The length of typeIds (${typeIds.length}) and pathSegments (${pathSegments.length}) does't match.`);
        const [primaryTypeId, ...embeddedTypeIds] = typeIds;
        const errors = [];
        const [primaryPath, ...embeddedPaths] = pathSegments;
        try {
            _a._validatePrimaryPath(primaryTypeId, primaryPath);
        }
        catch (e) {
            errors.push(e);
        }
        // if there's no embedded paths, we're done
        if (pathSegments.length === 1)
            return true;
        // TODO: make it so that a single globstar as full path matches any of its type -- even for embedded ones
        if (TypeId_js_1.default.canHaveEmbed(primaryTypeId, false))
            for (let i = 0; i < embeddedPaths.length; i++) {
                const currentTypeIds = typeIds.slice(0, i + 1);
                const embeddedPath = embeddedPaths[i];
                try {
                    EmbeddedId._validateEmbeddedPath(currentTypeIds, embeddedPath);
                }
                catch (e) {
                    errors.push(e);
                }
            }
        else if (embeddedPaths.length > 0) {
            errors.push(`"${primaryTypeId}" isn't an embedding type, but received embedded paths: ${JSON.stringify(embeddedPaths)}`);
        }
        if (errors.length)
            throw new Error(`Expected a valid ID path, but got ${pathSegments.join(CONST_js_1.default.TypeSep)}\n${errors.join('\n')}`);
        return true;
    }
    static _validateEmbeddedPath(typeIds, path) {
        const embeddedTypeId = typeIds.at(-1);
        const pathParts = path.split(CONST_js_1.default.PathKeySep);
        for (const part of pathParts)
            if (!(_a._validateDictKey(part) || _a._validateIndexKey(part)))
                throw new Error(`Expected a DictKey, array index, or wildcard, but got ${JSON.stringify(part)}`);
        return true;
    }
    static _validateIndexKey(value) {
        return TypeGuard_js_1.default.Wildcard(value) || TypeGuard_js_1.default.IndexKey(value);
    }
    /**
     * @throws If the typeId isn't a primary TypeId; if the path doesn't meet the minimum or maximum length for its type; or if any of the individual elements are invalid.
     */
    static _validatePrimaryPath(typeId, path) {
        if (!TypeGuard_js_1.default.PrimaryType(typeId))
            throw new Error(`Expected a primary TypeId, but got ${JSON.stringify(typeId)}. Valid TypeIds are: ${JSON.stringify(TypeId_js_1.default.Primary)}`);
        const { min, max } = __classPrivateFieldGet(this, _a, "m", _IdParser_getPathKeyCount).call(this, typeId);
        const [rulesPackageId, ...tail] = path.split(CONST_js_1.default.PathKeySep);
        const errors = [];
        let nonGlobstarCount = 0;
        let globstarCount = 0;
        switch (true) {
            case TypeGuard_js_1.default.Globstar(rulesPackageId):
                globstarCount++;
                break;
            case TypeGuard_js_1.default.Wildcard(rulesPackageId):
            case TypeGuard_js_1.default.RulesPackageId(rulesPackageId):
                nonGlobstarCount++;
                break;
            default:
                errors.push(`Expected RulesPackageId but got ${String(rulesPackageId)}`);
                break;
        }
        for (const k of tail)
            switch (true) {
                case TypeGuard_js_1.default.Globstar(k):
                    globstarCount++;
                    break;
                case TypeGuard_js_1.default.Wildcard(k):
                case TypeGuard_js_1.default.DictKey(k):
                    nonGlobstarCount++;
                    break;
                default:
                    errors.push(`Expected DictKey but got ${String(k)}`);
                    break;
            }
        if (nonGlobstarCount > max)
            // so this error appears first
            errors.unshift(`Path expects a maximum length of ${max}, but got ${nonGlobstarCount}`);
        if (nonGlobstarCount < min &&
            // if there's at least one globstar, then it'll expand to meet the minimum
            !(globstarCount > 0))
            errors.unshift(`Path expects a minimum length of ${min}, but got ${nonGlobstarCount}`);
        if (errors.length > 0)
            throw new Error(`Expected valid Primary ID path but got "${path}".\n\t${errors.join('\n\t')}`);
        return true;
    }
    /** @internal */
    static _validateDictKey(key) {
        return TypeGuard_js_1.default.AnyWildcard(key) || TypeGuard_js_1.default.DictKey(key);
    }
    static _getMatchesFrom(obj, matchKey = CONST_js_1.default.WildcardString) {
        switch (true) {
            case Array.isArray(obj):
                return __classPrivateFieldGet(this, _a, "m", _IdParser_getMatchesFromArray).call(this, obj, matchKey);
            case obj instanceof Map:
                return __classPrivateFieldGet(this, _a, "m", _IdParser_getMatchesFromMap).call(this, obj, matchKey);
            case typeof obj === 'object':
                return __classPrivateFieldGet(this, _a, "m", _IdParser_getMatchesFromRecord).call(this, obj, matchKey.toString());
            default:
                throw new Error(`Expected an Array, Map, or Record, but got ${String(obj)}`);
        }
    }
    /** @internal */
    _getRulesPackage(tree = _a.tree) {
        var _b, _c;
        if (tree == null)
            throw new Error(`No Datasworn tree found -- set the static property ${_a.constructor.name}#tree, or provide one as a parameter.`);
        if (this.isWildcard)
            throw new Error(`${this.constructor.name}#${this.get.name} expected a non-wildcard ID, but got <${this.id}>. If you want to get wildcard matches, use ${this.constructor.name}#${this.getMatches.name} instead.`);
        if (tree instanceof Map)
            return (_b = tree.get(this.rulesPackageId)) !== null && _b !== void 0 ? _b : undefined;
        return (_c = tree[this.rulesPackageId]) !== null && _c !== void 0 ? _c : undefined;
    }
    /** @internal */
    _getTypeBranch(tree = _a.tree) {
        const pkg = this._getRulesPackage(tree);
        if (pkg == null)
            throw new Error(`Couldn't find a RulesPackage with the id "${this.rulesPackageId}"`);
        return pkg[this.typeBranchKey];
    }
    /** @internal */
    _getUnsafe(tree = _a.tree) {
        var _b, _c;
        const typeBranch = this._getTypeBranch(tree);
        if (typeBranch == null)
            throw new Error(`RulesPackage <${this.rulesPackageId}> doesn't have a "${this.typeBranchKey}" type branch.`);
        const [rulesPackageKey, key, ..._tailKeys] = this.primaryPathKeys;
        let result;
        if (typeBranch instanceof Map)
            result = (_b = typeBranch.get(key)) !== null && _b !== void 0 ? _b : undefined;
        else
            result = (_c = typeBranch[key]) !== null && _c !== void 0 ? _c : undefined;
        if (result == null)
            throw new Error(`Couldn't find key <${key}> in <${this.rulesPackageId}.${this.typeBranchKey}>`);
        return result;
    }
    /** @internal */
    _matchRulesPackages(tree = _a.tree) {
        if (tree == null)
            throw new Error(`No Datasworn tree found -- set the static property ${_a.constructor.name}#tree, or provide one as a parameter.`);
        return _a._getMatchesFrom(tree, this.rulesPackageId);
    }
    /**
     * @internal */
    _getMatchesUnsafe(tree = _a.tree) {
        const pkgs = this._matchRulesPackages(tree);
        const results = new Map();
        const [_rulesPackageId, nextKey] = this.primaryPathKeys;
        for (const pkg of pkgs.values()) {
            const typeBranch = pkg[this.typeBranchKey];
            if (typeBranch == null)
                continue;
            const matches = _a._getMatchesFrom(typeBranch, nextKey).values();
            for (const match of matches)
                results.set(match._id, match);
        }
        return results;
    }
}
exports.IdParser = IdParser;
_a = IdParser, _IdParser_pathSegments = new WeakMap(), _IdParser_typeIds = new WeakMap(), _IdParser_validateEmbeddedTypeIdChain = function _IdParser_validateEmbeddedTypeIdChain(typeIds) {
    if (typeIds.length === 1)
        return true;
    for (let i = 1; i < typeIds.length; i++) {
        const embeddedTypeId = typeIds[i];
        const parentTypeId = typeIds[i - 1];
        const parentTypeIsEmbedded = i > 1;
        const embeddableTypes = TypeId_js_1.default.getEmbeddableTypes(parentTypeId, parentTypeIsEmbedded);
        if (!embeddableTypes.includes(embeddedTypeId)) {
            const parentTypeIdComposite = typeIds.slice(0, i).join(CONST_js_1.default.TypeSep);
            throw new Error(`Can't embed type "${embeddedTypeId}" in type "${parentTypeIdComposite}"`);
        }
    }
    return true;
}, _IdParser_validateTypeIds = function _IdParser_validateTypeIds(typeIds) {
    if (!Array.isArray(typeIds) ||
        !typeIds.every((str) => typeof str === 'string'))
        throw new Error(`Expected an array of strings but got ${JSON.stringify(typeIds)}`);
    const primaryTypeId = typeIds[0];
    if (!TypeGuard_js_1.default.PrimaryType(primaryTypeId))
        throw new Error(`Expected a primary type but got ${JSON.stringify(primaryTypeId)}`);
    for (let i = 1; i < typeIds.length; i++) {
        const embeddedTypeId = typeIds[i];
        const parentTypeId = typeIds[i - 1];
        const parentTypeIsEmbedded = i > 1;
        const embeddableTypes = TypeId_js_1.default.getEmbeddableTypes(parentTypeId, parentTypeIsEmbedded);
        if (!embeddableTypes.includes(embeddedTypeId)) {
            const parentTypeIdComposite = typeIds.slice(0, i).join(CONST_js_1.default.TypeSep);
            throw new Error(`Can't embed type "${embeddedTypeId}" in type "${parentTypeIdComposite}"`);
        }
    }
    return true;
}, _IdParser_toString = function _IdParser_toString({ typeIds, pathSegments }) {
    const leftSide = typeIds.join(CONST_js_1.default.TypeSep);
    const rightSide = pathSegments.join(CONST_js_1.default.TypeSep);
    return leftSide + CONST_js_1.default.PrefixSep + rightSide;
}, _IdParser_parseOptions = function _IdParser_parseOptions(id) {
    const [leftSide, rightSide] = id.split(CONST_js_1.default.PrefixSep);
    const typeIds = leftSide.split(CONST_js_1.default.TypeSep);
    const pathSegments = rightSide.split(CONST_js_1.default.TypeSep);
    return {
        typeIds,
        pathSegments
    };
}, _IdParser_getClassForPrimaryTypeId = function _IdParser_getClassForPrimaryTypeId(typeId) {
    switch (true) {
        case TypeGuard_js_1.default.CollectionType(typeId):
            // @ts-expect-error
            return CollectionId;
        case TypeGuard_js_1.default.CollectableType(typeId):
            // @ts-expect-error
            return CollectableId;
        case TypeGuard_js_1.default.NonCollectableType(typeId):
            // @ts-expect-error
            return NonCollectableId;
        default:
            throw new Error(`Expected TypeId.AnyPrimary, but got ${JSON.stringify(typeId)}`);
    }
}, _IdParser_getPathKeyCount = function _IdParser_getPathKeyCount(typeId) {
    let min, max;
    switch (true) {
        case TypeGuard_js_1.default.CollectionType(typeId):
            // has a rulespackage
            min = CONST_js_1.default.COLLECTION_DEPTH_MIN + 1;
            max = CONST_js_1.default.COLLECTION_DEPTH_MAX + 1;
            break;
        case TypeGuard_js_1.default.CollectableType(typeId):
            // has a rulespackage + its own key
            min = CONST_js_1.default.COLLECTION_DEPTH_MIN + 2;
            max = CONST_js_1.default.COLLECTION_DEPTH_MAX + 2;
            break;
        case TypeGuard_js_1.default.NonCollectableType(typeId):
            // has a rulespackage
            min = max = CONST_js_1.default.COLLECTION_DEPTH_MIN + 1;
            break;
        default:
            throw new Error(`Expected primary TypeId but got ${String(typeId)}`);
    }
    return { min, max };
}, _IdParser_getMatchesFromArray = function _IdParser_getMatchesFromArray(array, matchKey = CONST_js_1.default.WildcardString) {
    if (!Array.isArray(array))
        throw new Error(`Expected an Array, but got ${String(array)}`);
    // special case: a wildcard matches everything, so return it as a new Map
    if (TypeGuard_js_1.default.AnyWildcard(matchKey))
        return new Map(array.entries());
    const index = typeof matchKey === 'string' ? Number.parseInt(matchKey, 10) : matchKey;
    if (!Number.isInteger(index))
        throw Error(`Unable to parse an index (integer) from ${String(matchKey)}`);
    const results = new Map();
    const match = array[index];
    if (match != null)
        results.set(index, match);
    return results;
}, _IdParser_getMatchesFromMap = function _IdParser_getMatchesFromMap(map, matchKey = CONST_js_1.default.WildcardString) {
    if (!(map instanceof Map))
        throw new Error(`Expected a Map, but got ${String(map)}`);
    // special case: a wildcard matches everything, so return it as a new Map
    if (TypeGuard_js_1.default.AnyWildcard(matchKey))
        return new Map(map);
    const results = new Map();
    if (map.has(matchKey))
        results.set(matchKey, map.get(matchKey));
    return results;
}, _IdParser_getMatchesFromRecord = function _IdParser_getMatchesFromRecord(record, matchKey) {
    if (record == null || typeof record !== 'object' || Array.isArray(record))
        throw new Error(`Expected a Record object, but got ${String(record)}`);
    const results = new Map();
    switch (true) {
        case TypeGuard_js_1.default.AnyWildcard(matchKey):
            for (const k in record)
                if (Object.hasOwn(record, k))
                    results.set(k, record[k]);
            break;
        case Object.hasOwn(record, matchKey):
            results.set(matchKey, record[matchKey]);
            break;
        default:
            break;
    }
    return results;
};
IdParser.tree = null;
/**
 * The object used for log messages.
 * @default console
 */
IdParser.logger = console;
// Static properties
/** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
IdParser.datasworn = null;
IdParser.RulesPackagePattern = index_js_1.Pattern.RulesPackageElement;
IdParser.DictKeyPattern = index_js_1.Pattern.DictKeyElement;
IdParser.RecursiveDictKeyPattern = index_js_1.Pattern.RecursiveDictKeysElement;
class EmbeddingId extends IdParser {
    constructor() {
        super(...arguments);
        _EmbeddingId_instances.add(this);
    }
    createEmbeddedIdChild(typeId, key) {
        return new EmbeddedId(this, typeId, key);
    }
    get embeddableTypes() {
        return TypeId_js_1.default.getEmbeddableTypes(this.typeId, this instanceof EmbeddedId);
    }
    assignIdsIn(node, recursive, index) {
        const result = super.assignIdsIn(node, recursive, index);
        if (recursive)
            for (const embedTypeId of this.embedTypes) {
                const property = TypeId_js_1.default.getEmbeddedPropertyKey(embedTypeId);
                if (typeof node !== 'object')
                    continue;
                if (!(property in node))
                    continue;
                const childNodes = node[property];
                if (childNodes == null)
                    continue;
                if (Array.isArray(childNodes)) {
                    __classPrivateFieldGet(this, _EmbeddingId_instances, "m", _EmbeddingId_assignEmbeddedIdsInArray).call(this, childNodes, embedTypeId, recursive, index);
                }
                else if (childNodes instanceof Map) {
                    __classPrivateFieldGet(this, _EmbeddingId_instances, "m", _EmbeddingId_assignEmbeddedIdsInMap).call(this, childNodes, embedTypeId, recursive, index);
                }
                else {
                    __classPrivateFieldGet(this, _EmbeddingId_instances, "m", _EmbeddingId_assignEmbeddedIdsInRecord).call(this, childNodes, embedTypeId, recursive, index);
                }
            }
        return result;
    }
}
_EmbeddingId_instances = new WeakSet(), _EmbeddingId_assignEmbeddedIdsInMap = function _EmbeddingId_assignEmbeddedIdsInMap(children, nextTypeId, recursive, index) {
    children.forEach((childNode, k) => this.createEmbeddedIdChild(nextTypeId, k.toString()).assignIdsIn(childNode, recursive, index));
}, _EmbeddingId_assignEmbeddedIdsInRecord = function _EmbeddingId_assignEmbeddedIdsInRecord(children, nextTypeId, recursive, index) {
    for (const k in children) {
        if (!Object.hasOwn(children, k))
            continue;
        const childNode = children[k];
        if (childNode == null)
            continue;
        const childParser = this.createEmbeddedIdChild(nextTypeId, k);
        childParser.assignIdsIn(childNode, recursive, index);
    }
}, _EmbeddingId_assignEmbeddedIdsInArray = function _EmbeddingId_assignEmbeddedIdsInArray(children, nextTypeId, recursive, index) {
    children.forEach((childNode, i) => this.createEmbeddedIdChild(nextTypeId, i.toString()).assignIdsIn(childNode, recursive, index));
};
class NonCollectableId extends EmbeddingId {
    get isRecursive() {
        return false;
    }
    constructor(typeId, rulesPackage, key) {
        const pathSegment = [rulesPackage, key].join(CONST_js_1.default.PathKeySep);
        super({
            typeIds: [typeId],
            pathSegments: [pathSegment]
        });
    }
}
exports.NonCollectableId = NonCollectableId;
class CollectableId extends EmbeddingId {
    get isRecursive() {
        return true;
    }
    get embeddableTypes() {
        return TypeId_js_1.default.getEmbeddableTypes(this.primaryTypeId, false);
    }
    constructor(typeId, rulesPackage, ...pathKeys) {
        const pathSegment = [rulesPackage, ...pathKeys].join(CONST_js_1.default.PathKeySep);
        super({
            typeIds: [typeId],
            pathSegments: [pathSegment]
        });
    }
    get collectionAncestorKeys() {
        // 1st element is the RulesPackageId, which isn't counted.
        // last element is the key of this collectable, which isn't counted.
        return this.primaryPathKeys.slice(1, -1);
    }
    get recursionDepth() {
        return this.collectionAncestorKeys.length;
    }
    get parentTypeId() {
        return TypeId_js_1.default.getCollectionOf(this.typeId);
    }
    getCollectionIdParent() {
        const ancestorKeys = this.primaryPathKeys.slice(0, -1);
        return new CollectionId(this.parentTypeId, ...ancestorKeys);
    }
    /** @internal */
    _getMatchesUnsafe(tree = IdParser.tree) {
        const parentId = this.getCollectionIdParent();
        let matches;
        const thisKey = this.primaryPathKeys.at(-1);
        for (const colMatch of parentId._getMatchesUnsafe(tree).values()) {
            const contents = colMatch[CONST_js_1.default.ContentsKey];
            if (contents == null)
                continue;
            const collectables = IdParser._getMatchesFrom(contents, thisKey);
            for (const match of collectables.values()) {
                matches || (matches = new Map());
                matches.set(match._id, match);
            }
        }
        return matches !== null && matches !== void 0 ? matches : new Map();
    }
}
exports.CollectableId = CollectableId;
class CollectionId extends IdParser {
    constructor(typeId, rulesPackage, ...pathKeys) {
        const pathSegment = [rulesPackage, ...pathKeys].join(CONST_js_1.default.PathKeySep);
        super({
            typeIds: [typeId],
            pathSegments: [pathSegment]
        });
    }
    get isRecursive() {
        return true;
    }
    get recursionDepth() {
        // first element is the RulesPackageId, which isn't counted.
        return this.collectionAncestorKeys.length;
    }
    get collectionAncestorKeys() {
        // 1st key is the RulesPackageId, so it's omitted
        // last key is this Collection node -- it's omitted too
        // everything but the last key, which belongs to the node itself
        return this.primaryPathKeys.slice(1, -1);
    }
    /**
     * Create an ID representing a Collectable child of this CollectionId, using the provided key.
     * @example
     * ```typescript
     * const collection = new CollectionId('oracle_collection', 'starforged', 'core')
     * console.log(collection.toString()) // "oracle_collection:starforged/core"
     * const collectable = collection.createCollectableIdChild('action')
     * console.log(collectable.toString()) // "oracle_rollable:starforged/core/action"
     * ```
     */
    createCollectableIdChild(key) {
        return new CollectableId(TypeId_js_1.default.getCollectableOf(this.primaryTypeId), ...this.primaryPathKeys, key);
    }
    /**
     * Create an ID representing a Collection child of this CollectionId, using the provided key.
     * @throws If a child collection ID can't be created because the maximum recursion depth has been reached.
     * @see {@link CONST.COLLECTION_DEPTH_MAX}
     * @example
     * ```typescript
     * const collection = new CollectionId('oracle_collection', 'starforged', 'planet')
     * console.log(collection.toString()) // "oracle_collection:starforged/planet"
     * const childCollection = collection.createCollectionIdChild('furnace')
     * console.log(childCollection.toString()) // "oracle_collection:starforged/planet/furnace"
     * ```
     */
    createCollectionIdChild(key) {
        if (this.recursionDepth >= CONST_js_1.default.COLLECTION_DEPTH_MAX)
            throw new Errors_js_1.ParseError(this.id, `Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${CONST_js_1.default.COLLECTION_DEPTH_MAX})`);
        const { primaryTypeId, rulesPackageId: rulesPackage, primaryPathKeysWithinPkg: primaryDictKeyElements } = this;
        return new CollectionId(primaryTypeId, rulesPackage, ...primaryDictKeyElements, key);
    }
    assignIdsIn(node, recursive = true, index) {
        // run this up front so the log ordering is more intuitive
        const base = super.assignIdsIn(node, recursive, index);
        if (recursive) {
            if (CONST_js_1.default.ContentsKey in node && node[CONST_js_1.default.ContentsKey] != null)
                for (const childKey in node[CONST_js_1.default.ContentsKey]) {
                    const childNode = node[CONST_js_1.default.ContentsKey][childKey];
                    if (childNode == null)
                        continue;
                    const childParser = this.createCollectableIdChild(childKey);
                    childParser.assignIdsIn(childNode, recursive, index);
                }
            if (CONST_js_1.default.CollectionsKey in node && node[CONST_js_1.default.CollectionsKey] != null)
                for (const childKey in node[CONST_js_1.default.CollectionsKey]) {
                    const childCollection = node[CONST_js_1.default.CollectionsKey][childKey];
                    if (childCollection == null)
                        continue;
                    const childParser = this.createCollectionIdChild(childKey);
                    childParser.assignIdsIn(childCollection, recursive, index);
                }
        }
        return base;
    }
    /**
     * Returns a CollectionId representing the parent collection of this ID.
     * @throws If a parent collection ID isn't possible (because this ID doesn't have a parent collection.)
     * @example
     * ```typescript
     * const collection = new CollectionId('oracle_collection', 'starforged', 'planet')
     * console.log(collection.toString()) // "oracle_collection:starforged/planet/jungle/settlements"
     * const parentCollection = collection.getCollectionIdParent()
     * console.log(parentCollection.toString()) // "oracle_collection:starforged/planet/jungle"
     * ```
     */
    getCollectionIdParent() {
        if (this.collectionAncestorKeys.length === 0)
            throw new Errors_js_1.ParseError(this.id, `Can't generate a parent ID because this ID has no ancestors.`);
        return new CollectionId(this.primaryTypeId, this.rulesPackageId, ...this.collectionAncestorKeys);
    }
    /** @internal */
    _getUnsafe(tree) {
        const ancestorNode = super._getUnsafe(tree);
        const [_ancestorKey, ...keys] = this.primaryPathKeys;
        const ancestors = [ancestorNode];
        for (const key of keys) {
            const currentNode = ancestors.at(-1);
            if (!(CONST_js_1.default.CollectionsKey in currentNode))
                throw new Error(`Couldn't find collection <${key}> in <${currentNode._id}>`);
            const nextNode = currentNode[CONST_js_1.default.CollectionsKey][key];
            if (nextNode == null)
                throw new Error(`Expected collection <${key}> in <${currentNode._id}>, but got ${String(nextNode)}`);
            ancestors.push(nextNode);
        }
        return ancestors.at(-1);
    }
    /** @internal */
    static _recurseMatches(from, keys, matches = new Map(), depth = 0) {
        if (keys.length === 0)
            return matches.set(from._id, from);
        if (depth > CONST_js_1.default.COLLECTION_DEPTH_MAX) {
            console.warn(`Exceeded max collection depth (${CONST_js_1.default.COLLECTION_DEPTH_MAX}) @ <${from._id}>`);
            return matches;
        }
        const [currentKey, ...tailKeys] = keys;
        const children = from[CONST_js_1.default.CollectionsKey];
        if (children != null)
            return matches;
        for (const child of IdParser._getMatchesFrom(children, currentKey).values()) {
            if (TypeGuard_js_1.default.Globstar(currentKey))
                // recurse through children without consuming the globstar
                for (const [matchId, match] of CollectionId._recurseMatches(child, keys, matches, depth + 1))
                    matches.set(matchId, match);
            // regular key + * matches
            for (const [matchId, match] of CollectionId._recurseMatches(child, tailKeys, matches, depth + 1))
                matches.set(matchId, match);
        }
        return matches;
    }
    /** @internal */
    _getMatchesUnsafe(tree = IdParser.tree) {
        const pkgs = this._matchRulesPackages(tree);
        // defer creating this until we need it
        let matches;
        const [rulesPackageId, branchChildKey, ...tailKeys] = this.primaryPathKeys;
        for (const pkg of pkgs.values()) {
            const typeBranch = pkg[this.typeBranchKey];
            if (typeBranch == null)
                continue;
            for (const collection of IdParser._getMatchesFrom(typeBranch, branchChildKey).values())
                if (TypeGuard_js_1.default.Globstar(rulesPackageId))
                    // carry forward the rules package globstar if it's present
                    matches = CollectionId._recurseMatches(collection, [branchChildKey, ...tailKeys], matches);
                else
                    matches = CollectionId._recurseMatches(collection, tailKeys, matches);
        }
        return matches !== null && matches !== void 0 ? matches : new Map();
    }
}
exports.CollectionId = CollectionId;
// @ts-expect-error
class EmbeddedId extends EmbeddingId {
    /**
     * Returns the embedding ID parent of this ID.
     */
    getEmbeddingIdParent() {
        return __classPrivateFieldGet(this, _EmbeddedId_parent, "f");
    }
    constructor(parent, typeId, key) {
        const options = {
            typeIds: [...parent.typeIds, typeId],
            pathSegments: [...parent.pathSegments, key.toString()]
        };
        super(options);
        _EmbeddedId_parent.set(this, void 0);
        __classPrivateFieldSet(this, _EmbeddedId_parent, parent, "f");
    }
}
exports.EmbeddedId = EmbeddedId;
_EmbeddedId_parent = new WeakMap();
