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
var _IdParser_instances, _a, _IdParser_pathSegments, _IdParser_typeIds, _IdParser_validateTypeIds, _IdParser_toString, _IdParser_getIdFormat, _IdParser_validatePathSegments, _IdParser_validateIndexKey, _IdParser_assignIdsInDictionary, _IdParser_assignIdsInArray, _IdParser_globberPath, _IdParser_parseOptions, _IdParser_getClassForPrimaryTypeId, _IdParser_validateRulesPackage, _IdParser_validatePrimaryPathKeys, _IdParser_validateDictKey, _IdParser_validateCollectionKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionId = exports.EmbeddedId = exports.CollectableId = exports.NonCollectableId = exports.IdParser = void 0;
const CONST_js_1 = __importDefault(require("./IdElements/CONST.js"));
const TypeGuard_js_1 = __importDefault(require("./IdElements/TypeGuard.js"));
const TypeId_js_1 = __importDefault(require("./IdElements/TypeId.js"));
const ObjectGlobber_js_1 = __importDefault(require("./ObjectGlobber.js"));
const index_js_1 = require("./IdElements/index.js");
const Errors_js_1 = require("./Errors.js");
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
        const formatType = __classPrivateFieldGet(_a, _a, "m", _IdParser_getIdFormat).call(_a, this.primaryTypeId);
        __classPrivateFieldGet(_a, _a, "m", _IdParser_validatePathSegments).call(_a, formatType, value);
        if (this.typeIds.length !== value.length)
            throw new Error("The length of typeIds and pathSegments does't match.");
        __classPrivateFieldSet(this, _IdParser_pathSegments, value, "f");
    }
    constructor(options) {
        _IdParser_instances.add(this);
        _IdParser_pathSegments.set(this, void 0);
        _IdParser_typeIds.set(this, void 0);
        // Public static  methods
        /** Lazy prop for this ID's Globber */
        _IdParser_globberPath.set(this, null
        /** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
         * @internal
         */
        );
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
    createdEmbeddedId(typeId, key) {
        _a.logger.debug(`[createdEmbeddedId] ${this.id} > ${typeId}, ${key}`);
        return new EmbeddedId(this, typeId, key.toString());
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
    get primaryTypeId() {
        return this.typeIds[0];
    }
    get primaryPath() {
        return this.pathSegments[0];
    }
    get primaryPathElements() {
        return this.primaryPath.split(CONST_js_1.default.PathSep);
    }
    get rulesPackage() {
        return this.primaryPathElements[0];
    }
    get primaryDictKeyElements() {
        // omit rules package, which is the first
        const [_rulesPackage, ...keyElements] = this.primaryPathElements;
        return keyElements;
    }
    get fullTypeId() {
        return this.typeIds.join(CONST_js_1.default.PathTypeSep);
    }
    get fullPath() {
        return this.pathSegments.join(CONST_js_1.default.PathTypeSep);
    }
    get targetTypeId() {
        return this.typeIds.at(-1);
    }
    get lastProperty() {
        return TypeId_js_1.default.getRootKey(this.fullTypeId);
    }
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard() {
        return this.id.includes(CONST_js_1.default.WildcardString);
    }
    /** May this ID contain recursive elements in its path? */
    get isRecursive() {
        return this.isCollectable || this.isCollection;
    }
    /** Does this ID include a collectable object in its path? */
    get isCollectable() {
        return TypeGuard_js_1.default.CollectableType(this.primaryTypeId);
    }
    /** Does this ID include a collection object in its path? */
    get isCollection() {
        return TypeGuard_js_1.default.CollectionType(this.primaryTypeId);
    }
    /** Assign a string ID to a Datasworn node, and all eligible descendant nodes.
     * @param node The Datasworn
     * @param recursive Should IDs be assigned to descendant objects too? (default: true)
     * @returns The mutated object.
     */
    assignIdsIn(node, recursive = true, index) {
        if (typeof node._id === 'string')
            _a.logger.warn(`Can't assign <${this.id}>, node already has <${node._id}>`);
        else {
            node._id = this.id;
            _a.logger.debug(`[assignIdsIn] Assigned ${this.constructor.name} @ <${this.id}>`);
        }
        if (recursive) {
            const embeddedTypes = TypeId_js_1.default.getEmbeddableTypes(this.fullTypeId);
            for (const nextTypeId of embeddedTypes) {
                const property = TypeId_js_1.default.getEmbeddedPropertyKey(nextTypeId);
                if (!(property in node))
                    continue;
                const childNodes = node[property];
                if (childNodes == null)
                    continue;
                if (Array.isArray(childNodes)) {
                    __classPrivateFieldGet(this, _IdParser_instances, "m", _IdParser_assignIdsInArray).call(this, childNodes, nextTypeId, recursive, index);
                }
                else {
                    __classPrivateFieldGet(this, _IdParser_instances, "m", _IdParser_assignIdsInDictionary).call(this, childNodes, nextTypeId, recursive, index);
                }
            }
        }
        if (index instanceof Map)
            index.set(this.id, node);
        return node;
    }
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.datasworn} or as an argument).
     */
    get(tree) {
        return _a.get(this, tree);
    }
    static get(id, tree = _a.datasworn) {
        const parsedId = id instanceof _a ? id : _a.parse(id);
        return parsedId.toGlobberPath().walk(tree);
    }
    /** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
     * @internal
     */
    toGlobberPath() {
        if (__classPrivateFieldGet(this, _IdParser_globberPath, "f") instanceof ObjectGlobber_js_1.default)
            return __classPrivateFieldGet(this, _IdParser_globberPath, "f");
        const dotPath = [];
        const [rulesPackage, trunkKey, ...branchKeys] = this.primaryPathElements;
        const [primaryTypeId, ...embeddedTypeIds] = this.typeIds;
        const [primaryPath, ...embeddedPaths] = this.pathSegments;
        // primary path
        // "starforged"
        dotPath.push(rulesPackage);
        //  "starforged.oracles"
        dotPath.push(TypeId_js_1.default.getRootKey(primaryTypeId));
        //  "starforged.oracles.core"
        dotPath.push(trunkKey);
        for (let i = 0; i < branchKeys.length; i++) {
            const currentKey = branchKeys[i];
            const isLastKey = i === branchKeys.length - 1;
            const dictionaryProperty = this.isCollectable && isLastKey
                ? CONST_js_1.default.ContentsKey
                : CONST_js_1.default.CollectionsKey;
            dotPath.push(dictionaryProperty, currentKey);
        }
        for (let i = 0; i < embeddedTypeIds.length; i++) {
            const typeId = embeddedTypeIds[i];
            const path = embeddedPaths[i];
            const property = TypeId_js_1.default.getEmbeddedPropertyKey(typeId);
            dotPath.push(property, path);
        }
        __classPrivateFieldSet(this, _IdParser_globberPath, new ObjectGlobber_js_1.default(...dotPath), "f");
        return __classPrivateFieldGet(this, _IdParser_globberPath, "f");
    }
    /**
     * Recursively assigns IDs to all eligibile nodes within a given {@link DataswornSource.RulesPackage}.
     * @param rulesPackage The rules package to assign IDs to. This function mutates the object.
     * @param index If provided, nodes that receive IDs will be indexed in the map (with their ID as the key).
     * @returns The mutated `rulesPackage`, which now satisfies the requirements for a complete {@link Datasworn.RulesPackage}
     */
    static assignIdsInRulesPackage(rulesPackage, index) {
        const errorMessages = [];
        for (const typeId in TypeId_js_1.default.RootKeys) {
            const typeRootKey = TypeId_js_1.default.getRootKey(typeId);
            const typeRoot = rulesPackage[typeRootKey];
            if (typeRoot == null)
                continue;
            for (const dictKey in typeRoot) {
                const trunkNode = typeRoot[dictKey];
                if (trunkNode == null)
                    continue;
                const id = `${typeId}${CONST_js_1.default.PrefixSep}${rulesPackage._id}${CONST_js_1.default.PathSep}${dictKey}`;
                let parser;
                try {
                    switch (true) {
                        case TypeGuard_js_1.default.CollectionType(typeId):
                            parser = new CollectionId(typeId, rulesPackage._id, dictKey);
                            parser.assignIdsIn(trunkNode, true, index);
                            break;
                        case TypeGuard_js_1.default.NonCollectableType(typeId):
                            parser = new NonCollectableId(typeId, rulesPackage._id, dictKey);
                            parser.assignIdsIn(trunkNode, true, index);
                            break;
                        default:
                            break;
                    }
                }
                catch (e) {
                    errorMessages.push(`Failed to create ID within <${id}>. ${String(e)}`);
                }
            }
        }
        if (errorMessages.length > 0)
            throw new Error(errorMessages.join('\n'));
        // @ts-expect-error
        return rulesPackage;
    }
    static parse(id) {
        const { typeIds, pathSegments } = __classPrivateFieldGet(this, _a, "m", _IdParser_parseOptions).call(this, id);
        const [primaryTypeId, ...embeddedTypeIds] = typeIds;
        const [primaryPath, ...embeddedPaths] = pathSegments;
        const [rulesPackage, ...pathKeys] = primaryPath.split(CONST_js_1.default.PathSep);
        const Ctor = __classPrivateFieldGet(_a, _a, "m", _IdParser_getClassForPrimaryTypeId).call(_a, primaryTypeId);
        // @ts-expect-error
        const base = new Ctor(primaryTypeId, rulesPackage, ...pathKeys);
        if (embeddedTypeIds.length === 0)
            return base;
        let lastParser = base;
        for (let i = 0; i < embeddedTypeIds.length; i++) {
            const typeId = embeddedTypeIds[i];
            const pathKey = embeddedPaths[i];
            lastParser = lastParser.createdEmbeddedId(typeId, pathKey);
        }
        return lastParser;
    }
}
exports.IdParser = IdParser;
_a = IdParser, _IdParser_pathSegments = new WeakMap(), _IdParser_typeIds = new WeakMap(), _IdParser_globberPath = new WeakMap(), _IdParser_instances = new WeakSet(), _IdParser_validateTypeIds = function _IdParser_validateTypeIds(typeIds) {
    if (!(Array.isArray(typeIds) &&
        typeIds.every((str) => typeof str === 'string')))
        throw new Error(`Expected an array of strings but got ${JSON.stringify(typeIds)}`);
    const [primaryTypeId, ...embeddedTypeIds] = typeIds;
    if (!TypeGuard_js_1.default.AnyPrimaryType(primaryTypeId))
        throw new Error(`Expected a primary type but got ${JSON.stringify(primaryTypeId)}`);
    for (const typeId of embeddedTypeIds)
        if (!(TypeGuard_js_1.default.EmbedOnlyType(typeId) ||
            TypeGuard_js_1.default.EmbeddablePrimaryType(typeId)))
            throw new Error(`Expected an embeddable type but got ${JSON.stringify(typeId)}`);
    return true;
}, _IdParser_toString = function _IdParser_toString({ typeIds, pathSegments }) {
    const leftSide = typeIds.join(CONST_js_1.default.PathTypeSep);
    const rightSide = pathSegments.join(CONST_js_1.default.PathTypeSep);
    return leftSide + CONST_js_1.default.PrefixSep + rightSide;
}, _IdParser_getIdFormat = function _IdParser_getIdFormat(value) {
    let primaryPathFormat;
    switch (true) {
        case TypeGuard_js_1.default.CollectionType(value):
            primaryPathFormat = 'collection';
            break;
        case TypeGuard_js_1.default.CollectableType(value):
            primaryPathFormat = 'collectable';
            break;
        case TypeGuard_js_1.default.NonCollectableType(value):
            primaryPathFormat = 'non_collectable';
            break;
        default:
            throw new Error(`Expected primary TypeId but got ${value}`);
    }
    return primaryPathFormat;
}, _IdParser_validatePathSegments = function _IdParser_validatePathSegments(formatType, pathSegments) {
    if (!(Array.isArray(pathSegments) &&
        pathSegments.every((str) => typeof str === 'string')))
        throw new Error(`Expected an array of strings, but got ${JSON.stringify(pathSegments)}`);
    const [primaryPath, ...embeddedPaths] = pathSegments;
    const [rulesPackage, ...primaryPathKeys] = primaryPath.split(CONST_js_1.default.PathSep);
    if (!__classPrivateFieldGet(_a, _a, "m", _IdParser_validateRulesPackage).call(_a, rulesPackage))
        throw new Error(`Expected a RulesPackageId, but got ${JSON.stringify(rulesPackage)}`);
    for (const key of primaryPathKeys)
        if (!__classPrivateFieldGet(_a, _a, "m", _IdParser_validateDictKey).call(_a, key))
            throw new Error(`Expected a DictKey or wildcard, but got ${JSON.stringify(key)}`);
    for (const embeddedPath of embeddedPaths) {
        const pathParts = embeddedPath.split(CONST_js_1.default.PathSep);
        for (const pathPart of pathParts)
            if (!(__classPrivateFieldGet(_a, _a, "m", _IdParser_validateDictKey).call(_a, pathPart) ||
                __classPrivateFieldGet(_a, _a, "m", _IdParser_validateIndexKey).call(_a, pathPart)))
                throw new Error(`Expected a DictKey, array index, or wildcard, but got ${JSON.stringify(pathPart)}`);
    }
    __classPrivateFieldGet(_a, _a, "m", _IdParser_validatePrimaryPathKeys).call(_a, formatType, primaryPathKeys);
    return true;
}, _IdParser_validateIndexKey = function _IdParser_validateIndexKey(value) {
    return TypeGuard_js_1.default.Wildcard(value) || TypeGuard_js_1.default.IndexKey(value);
}, _IdParser_assignIdsInDictionary = function _IdParser_assignIdsInDictionary(childNodes, nextTypeId, recursive, index) {
    _a.logger.debug('[#assignIdsInDictionary]');
    for (const k in childNodes) {
        const childNode = childNodes[k];
        if (childNode == null)
            continue;
        const childParser = this.createdEmbeddedId(nextTypeId, k);
        childParser.assignIdsIn(childNode, recursive, index);
    }
}, _IdParser_assignIdsInArray = function _IdParser_assignIdsInArray(childNodes, nextTypeId, recursive, index) {
    _a.logger.debug('[#assignIdsInArray]');
    for (let i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];
        const childParser = this.createdEmbeddedId(nextTypeId, i);
        childParser.assignIdsIn(childNode, recursive, index);
    }
}, _IdParser_parseOptions = function _IdParser_parseOptions(id) {
    const [leftSide, rightSide] = id.split(CONST_js_1.default.PrefixSep);
    const typeIds = leftSide.split(CONST_js_1.default.PathTypeSep);
    const pathSegments = rightSide.split(CONST_js_1.default.PathTypeSep);
    return {
        typeIds,
        pathSegments
    };
}, _IdParser_getClassForPrimaryTypeId = function _IdParser_getClassForPrimaryTypeId(typeId) {
    switch (true) {
        case TypeGuard_js_1.default.CollectionType(typeId):
            return CollectionId;
        case TypeGuard_js_1.default.CollectableType(typeId):
            return CollectableId;
        case TypeGuard_js_1.default.NonCollectableType(typeId):
            return NonCollectableId;
        default:
            throw new Error(`Expected TypeId.AnyPrimary, but got ${JSON.stringify(typeId)}`);
    }
}, _IdParser_validateRulesPackage = function _IdParser_validateRulesPackage(key) {
    return TypeGuard_js_1.default.RulesPackageId(key) || TypeGuard_js_1.default.Wildcard(key);
}, _IdParser_validatePrimaryPathKeys = function _IdParser_validatePrimaryPathKeys(format, pathKeys) {
    let min;
    let max;
    let isRecursive;
    switch (format) {
        // collectables get an additional key -- this is the key of the collectable itself
        case 'collectable':
            min = CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MIN + 1;
            max = CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MAX + 1;
            isRecursive = true;
            break;
        case 'collection':
            min = CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MIN;
            max = CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MAX;
            isRecursive = true;
            break;
        case 'non_collectable':
        default:
            min = max = CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MIN;
            isRecursive = false;
    }
    if (pathKeys.length > max || pathKeys.length < min)
        throw new Error(`Expected ${min === max ? min : `${min}-${max}`} path elements, but got ${pathKeys.length}`);
    const badCollectionKeys = pathKeys.filter((key) => !__classPrivateFieldGet(this, _a, "m", _IdParser_validateCollectionKey).call(this, key, isRecursive));
    if (badCollectionKeys.length > 0)
        throw new Error(`Received invalid ancestor collection keys: ${JSON.stringify(badCollectionKeys)}`);
    if (TypeGuard_js_1.default.Globstar(pathKeys.at(-1)) && format !== 'collection')
        throw new Error(`Received a recursive wildcard as a key for a non-recursive collection type`);
    return true;
}, _IdParser_validateDictKey = function _IdParser_validateDictKey(key) {
    return TypeGuard_js_1.default.AnyWildcard(key) || TypeGuard_js_1.default.DictKey(key);
}, _IdParser_validateCollectionKey = function _IdParser_validateCollectionKey(key, recursive = false) {
    return recursive
        ? TypeGuard_js_1.default.Globstar(key) || __classPrivateFieldGet(this, _a, "m", _IdParser_validateDictKey).call(this, key)
        : __classPrivateFieldGet(this, _a, "m", _IdParser_validateDictKey).call(this, key);
};
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
class NonCollectableId extends IdParser {
    constructor(typeId, rulesPackage, key) {
        const pathSegment = [rulesPackage, key].join(CONST_js_1.default.PathSep);
        super({
            typeIds: [typeId],
            pathSegments: [pathSegment]
        });
    }
}
exports.NonCollectableId = NonCollectableId;
class CollectableId extends IdParser {
    constructor(typeId, rulesPackage, ...pathKeys) {
        const pathSegment = [rulesPackage, ...pathKeys].join(CONST_js_1.default.PathSep);
        super({
            typeIds: [typeId],
            pathSegments: [pathSegment]
        });
    }
    get recursionDepth() {
        // don't count this id's own key -- only collection depth is counted
        return this.primaryDictKeyElements.length - 1;
    }
}
exports.CollectableId = CollectableId;
class CollectionId extends IdParser {
    constructor(typeId, rulesPackage, ...pathKeys) {
        const pathSegment = [rulesPackage, ...pathKeys].join(CONST_js_1.default.PathSep);
        super({
            typeIds: [typeId],
            pathSegments: [pathSegment]
        });
    }
    get recursionDepth() {
        return this.primaryDictKeyElements.length;
    }
    get collectionAncestorKeys() {
        // everything but the last key, which belongs to the ID target
        return this.primaryDictKeyElements.slice(0, -1);
    }
    createChild(key) {
        return new CollectableId(TypeId_js_1.default.getCollectableOf(this.primaryTypeId), ...this.primaryPathElements, key);
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
                    const childParser = this.createChild(childKey);
                    childParser.assignIdsIn(childNode, recursive, index);
                }
            if (CONST_js_1.default.CollectionsKey in node && node[CONST_js_1.default.CollectionsKey] != null)
                for (const childKey in node[CONST_js_1.default.CollectionsKey]) {
                    const childCollection = node[CONST_js_1.default.CollectionsKey][childKey];
                    if (childCollection == null)
                        continue;
                    const childParser = this.createCollectionChild(childKey);
                    childParser.assignIdsIn(childCollection, recursive, index);
                }
        }
        return base;
    }
    /**
     * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
     */
    getParentCollection() {
        if (this.collectionAncestorKeys.length === 0)
            throw new Errors_js_1.ParseError(this.id, `Can't generate a parent ID because this ID has no ancestors.`);
        return new CollectionId(this.primaryTypeId, this.rulesPackage, ...this.collectionAncestorKeys);
    }
    /**
     * @throws If a child collection ID can't be created because the maximum recursion depth has been reached.
     * @see {@link CONST.RECURSIVE_PATH_ELEMENTS_MAX}
     */
    createCollectionChild(key) {
        if (this.recursionDepth >= CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MAX)
            throw new Errors_js_1.ParseError(this.id, `Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MAX})`);
        return new CollectionId(this.primaryTypeId, this.rulesPackage, ...this.primaryDictKeyElements, key);
    }
}
exports.CollectionId = CollectionId;
class EmbeddedId extends IdParser {
    constructor(parent, typeId, key) {
        const options = {
            typeIds: [...parent.typeIds, typeId],
            pathSegments: [...parent.pathSegments, key.toString()]
        };
        super(options);
    }
}
exports.EmbeddedId = EmbeddedId;
// const f = new CollectableId('asset', 'starforged', 'path', 'archer')
// const ff = f.createEmbeddedId('ability', 0)
// const fff = ff.createEmbeddedId('move', 'craft_arrows')
// IdParser.logger.log(f.id, f.toGlobberPath())
// IdParser.logger.log(ff.id, ff.toGlobberPath())
// IdParser.logger.log(fff.id, fff.toGlobberPath())
