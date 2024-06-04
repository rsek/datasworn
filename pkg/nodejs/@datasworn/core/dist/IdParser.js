"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _IdParser_instances, _a, _IdParser_rulesPackage, _IdParser_typeId, _IdParser_pathKeys, _IdParser_matcher, _IdParser_resetCachedProperties, _IdParser_globber, _IdParser_createMatcher, _IdParser_getPatternFragment, _IdParser_parse, _IdParser_validateOptions, _IdParser_getFormatType, _IdParser_validateRulesPackage, _IdParser_validatePathKeys, _IdParser_validateDictKey, _IdParser_validateCollectionKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecursiveCollectionId = exports.RecursiveCollectableId = exports.NonRecursiveCollectionId = exports.NonRecursiveCollectableId = exports.NonCollectableId = exports.IdParser = void 0;
const Errors_js_1 = require("./Errors.js");
const index_js_1 = require("./IdElements/index.js");
const ObjectGlobber_js_1 = __importDefault(require("./ObjectGlobber.js"));
class IdParser {
    constructor({ rulesPackage, typeId, pathKeys }) {
        _IdParser_instances.add(this);
        // ID parts
        _IdParser_rulesPackage.set(this, void 0);
        _IdParser_typeId.set(this, void 0);
        _IdParser_pathKeys.set(this, void 0);
        _IdParser_matcher.set(this, null
        /** Reset any cached matchers or paths. */
        );
        /** Lazy prop for this ID's Globber */
        _IdParser_globber.set(this, null
        /** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
         * @internal
         */
        );
        __classPrivateFieldSet(this, _IdParser_rulesPackage, rulesPackage, "f");
        __classPrivateFieldSet(this, _IdParser_typeId, typeId, "f");
        __classPrivateFieldSet(this, _IdParser_pathKeys, pathKeys, "f");
    }
    get rulesPackage() {
        return __classPrivateFieldGet(this, _IdParser_rulesPackage, "f");
    }
    set rulesPackage(value) {
        if (__classPrivateFieldGet(_a, _a, "m", _IdParser_validateRulesPackage).call(_a, value))
            throw new Error(`${value} is not a valid RulesPackageId or wildcard ("${index_js_1.CONST.WildcardString}").`);
        __classPrivateFieldGet(this, _IdParser_instances, "m", _IdParser_resetCachedProperties).call(this);
        __classPrivateFieldSet(this, _IdParser_rulesPackage, value, "f");
    }
    get typeId() {
        return __classPrivateFieldGet(this, _IdParser_typeId, "f");
    }
    get pathKeys() {
        return __classPrivateFieldGet(this, _IdParser_pathKeys, "f");
    }
    get typeRootKey() {
        return index_js_1.NodeTypeId.getRootKey(this.typeId);
    }
    // computed properties
    /** The parsed elements of the ID as an array of strings. */
    get elements() {
        return [this.rulesPackage, this.typeId, ...this.pathKeys];
    }
    /**
     * Returns a string representation of the ID.
     */
    get id() {
        return this.elements.join(index_js_1.CONST.Sep);
    }
    /**
     * Returns a string representation of the ID. Effectively an alias for {@link IdParser.id}
     */
    toString() {
        return this.id;
    }
    /** Key elements that represent ancestor collection keys. */
    get collectionAncestorKeys() {
        return this.pathKeys.slice(0, -1);
    }
    /** The last `pathKey` element, which represents the key for the identified object. */
    get key() {
        return this.pathKeys.at(-1);
    }
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard() {
        return this.elements.some(index_js_1.TypeGuard.AnyWildcard);
    }
    /** Does this ID contain recursive elements? */
    get isRecursive() {
        return (index_js_1.TypeGuard.RecursiveCollectableType(this.typeId) ||
            index_js_1.TypeGuard.RecursiveCollectionType(this.typeId));
    }
    /** Does this ID refer to a collectable object? */
    get isCollectable() {
        return index_js_1.TypeGuard.CollectableType(this.typeId);
    }
    /** Does this ID refer to a collection? */
    get isCollection() {
        return index_js_1.TypeGuard.CollectionType(this.typeId);
    }
    /** The regular expression that matches for a wildcard ID. */
    get matcher() {
        if (!(__classPrivateFieldGet(this, _IdParser_matcher, "f") instanceof RegExp))
            __classPrivateFieldSet(this, _IdParser_matcher, __classPrivateFieldGet(_a, _a, "m", _IdParser_createMatcher).call(_a, ...this.elements), "f");
        return __classPrivateFieldGet(this, _IdParser_matcher, "f");
    }
    /** Converts the ID to an ObjectGlobber representing the actual path to the identified object.
     * @internal
     */
    toPath() {
        if (__classPrivateFieldGet(this, _IdParser_globber, "f") == null) {
            const path = _a.toPath(this);
            __classPrivateFieldSet(this, _IdParser_globber, path, "f");
            return path;
        }
        return __classPrivateFieldGet(this, _IdParser_globber, "f");
    }
    /**
     * Get a Datasworn node by its ID.
     * @throws If the ID is invalid; if a path to the identified object can't be found; if no Datasworn tree is provided (either in {@link IdParser.datasworn} or as an argument).
     */
    get(tree) {
        return _a.get(this, tree);
    }
    static get(id, tree = _a.datasworn) {
        const parsedId = id instanceof _a ? id : _a.fromString(id);
        return parsedId.toPath().walk(tree);
    }
    static fromOptions(options) {
        __classPrivateFieldGet(this, _a, "m", _IdParser_validateOptions).call(this, options);
        const { rulesPackage, typeId: type, pathKeys } = options;
        switch (true) {
            case index_js_1.TypeGuard.NonCollectableType(type):
                return new NonCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.NonRecursiveCollectableType(type):
                return new NonRecursiveCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.RecursiveCollectableType(type):
                return new RecursiveCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.RecursiveCollectionType(type):
                return new RecursiveCollectionId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.NonRecursiveCollectionType(type):
                return new NonRecursiveCollectionId(rulesPackage, type, ...pathKeys);
            default:
                throw new Errors_js_1.ParseError([rulesPackage, type, ...pathKeys].join(index_js_1.CONST.Sep), `Parsed ID doesn't belong to a known ID type, and can't be assigned a subclass.`);
        }
    }
    static toPath(options) {
        const parsedId = options instanceof _a
            ? options
            : typeof options === 'string'
                ? _a.fromString(options)
                : _a.fromOptions(options);
        const dotPathElements = [];
        // e.g. "starforged"
        dotPathElements.push(parsedId.rulesPackage);
        // e.g. "starforged.oracles"
        dotPathElements.push(parsedId.typeRootKey);
        if (parsedId.collectionAncestorKeys.length > 0) {
            // console.log(_id.ancestorCollectionKeys)
            const [rootAncestor, ...ancestors] = parsedId.collectionAncestorKeys;
            // first ancestor collection key is always a key in the root object for the type
            dotPathElements.push(rootAncestor);
            // add path elements to navigate to any further ancestor keys
            for (const collectionKey of ancestors)
                dotPathElements.push(
                // get the collection's dictionary of child collections
                index_js_1.CONST.CollectionsKey, 
                // get the child collection by its key
                collectionKey);
            // add path to the dictionary that contains the final key
            if (parsedId.isCollection)
                dotPathElements.push(index_js_1.CONST.CollectionsKey);
            else if (parsedId.isCollectable)
                dotPathElements.push(index_js_1.CONST.ContentsKey);
        }
        dotPathElements.push(parsedId.key);
        return new ObjectGlobber_js_1.default(...dotPathElements);
    }
    static fromString(id) {
        const options = __classPrivateFieldGet(_a, _a, "m", _IdParser_parse).call(_a, id);
        return _a.fromOptions(options);
    }
}
exports.IdParser = IdParser;
_a = IdParser, _IdParser_rulesPackage = new WeakMap(), _IdParser_typeId = new WeakMap(), _IdParser_pathKeys = new WeakMap(), _IdParser_matcher = new WeakMap(), _IdParser_globber = new WeakMap(), _IdParser_instances = new WeakSet(), _IdParser_resetCachedProperties = function _IdParser_resetCachedProperties() {
    __classPrivateFieldSet(this, _IdParser_matcher, null, "f");
    __classPrivateFieldSet(this, _IdParser_globber, null, "f");
}, _IdParser_createMatcher = function _IdParser_createMatcher(...elements) {
    return new RegExp('^' + elements.map(__classPrivateFieldGet(_a, _a, "m", _IdParser_getPatternFragment)).join(index_js_1.CONST.Sep) + '$');
}, _IdParser_getPatternFragment = function _IdParser_getPatternFragment(element, index) {
    switch (element) {
        case index_js_1.CONST.WildcardString:
            // if it's the first element, return the RulesPackage-specific pattern
            return index === 0
                ? _a.RulesPackagePattern.source
                : _a.DictKeyPattern.source;
        case index_js_1.CONST.GlobstarString:
            // TODO: to enforce maximum depth, dynamically generate this pattern based on current recursion level
            return _a.RecursiveDictKeyPattern.source;
        default:
            return element;
    }
}, _IdParser_parse = function _IdParser_parse(id) {
    const [rulesPackage, type, ...pathKeys] = id.split(index_js_1.CONST.Sep);
    const result = {
        rulesPackage,
        typeId: type,
        pathKeys
    };
    try {
        __classPrivateFieldGet(this, _a, "m", _IdParser_validateOptions).call(this, result);
    }
    catch (e) {
        throw new Errors_js_1.ParseError(id, e);
    }
    return result;
}, _IdParser_validateOptions = function _IdParser_validateOptions({ rulesPackage, typeId: type, pathKeys }) {
    if (!__classPrivateFieldGet(this, _a, "m", _IdParser_validateRulesPackage).call(this, rulesPackage))
        throw new Error(`"${String(rulesPackage)}" is not a valid Datasworn package ID or wildcard.`);
    // validate type
    const formatType = __classPrivateFieldGet(this, _a, "m", _IdParser_getFormatType).call(this, type);
    // validate path keys
    __classPrivateFieldGet(this, _a, "m", _IdParser_validatePathKeys).call(this, pathKeys, formatType);
    return true;
}, _IdParser_getFormatType = function _IdParser_getFormatType(typeId) {
    switch (true) {
        case index_js_1.TypeGuard.NonCollectableType(typeId):
            return 'non_collectable';
        case index_js_1.TypeGuard.NonRecursiveCollectableType(typeId):
            return 'non_recursive_collectable';
        case index_js_1.TypeGuard.RecursiveCollectableType(typeId):
            return 'recursive_collectable';
        case index_js_1.TypeGuard.NonRecursiveCollectionType(typeId):
            return 'non_recursive_collection';
        case index_js_1.TypeGuard.RecursiveCollectionType(typeId):
            return 'recursive_collection';
        default:
            throw new Error(`"${String(typeId)}" is not a valid Datasworn node type.`);
    }
}, _IdParser_validateRulesPackage = function _IdParser_validateRulesPackage(key) {
    return index_js_1.TypeGuard.RulesPackageId(key) || index_js_1.TypeGuard.Wildcard(key);
}, _IdParser_validatePathKeys = function _IdParser_validatePathKeys(pathKeys, format) {
    let min;
    let max;
    let isRecursive;
    switch (format) {
        // collectables get an additional key -- this is the key of the collectable itself
        case 'non_recursive_collectable':
            min = max = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MIN + 1;
            isRecursive = false;
            break;
        case 'recursive_collectable':
            min = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MIN + 1;
            max = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX + 1;
            isRecursive = true;
            break;
        case 'recursive_collection':
            min = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MIN;
            max = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX;
            isRecursive = true;
            break;
        case 'non_recursive_collection':
        case 'non_collectable':
        default:
            min = max = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MIN;
            isRecursive = false;
    }
    if (pathKeys.length > max || pathKeys.length < min)
        throw new Error(`Expected ${min === max ? min : `${min}-${max}`} path elements, but got ${pathKeys.length}`);
    const badCollectionKeys = pathKeys.filter((key) => !__classPrivateFieldGet(this, _a, "m", _IdParser_validateCollectionKey).call(this, key, isRecursive));
    if (badCollectionKeys.length > 0)
        throw new Error(`Received invalid ancestor collection keys: ${JSON.stringify(badCollectionKeys)}`);
    if (index_js_1.TypeGuard.Globstar(pathKeys.at(-1)) &&
        format !== 'recursive_collection')
        throw new Error(`Received a recursive wildcard as a key for a non-recursive collection type`);
    return true;
}, _IdParser_validateDictKey = function _IdParser_validateDictKey(key, recursive = false, collection = false) {
    if (recursive && collection)
        index_js_1.TypeGuard.AnyWildcard(key) || index_js_1.TypeGuard.DictKey(key);
    return index_js_1.TypeGuard.Wildcard(key) || index_js_1.TypeGuard.DictKey(key);
}, _IdParser_validateCollectionKey = function _IdParser_validateCollectionKey(key, recursive = false) {
    return recursive
        ? index_js_1.TypeGuard.Globstar(key) || __classPrivateFieldGet(this, _a, "m", _IdParser_validateDictKey).call(this, key)
        : __classPrivateFieldGet(this, _a, "m", _IdParser_validateDictKey).call(this, key);
};
// Static properties
/** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
IdParser.datasworn = null;
IdParser.RulesPackagePattern = index_js_1.Pattern.RulesPackageElement;
IdParser.DictKeyPattern = index_js_1.Pattern.DictKeyElement;
IdParser.RecursiveDictKeyPattern = index_js_1.Pattern.RecursiveDictKeyElement;
// derived classes
class NonCollectableId extends IdParser {
    constructor(rulesPackage, type, key) {
        super({ rulesPackage, typeId: type, pathKeys: [key] });
    }
}
exports.NonCollectableId = NonCollectableId;
class CollectableId extends IdParser {
}
class NonRecursiveCollectableId extends CollectableId {
    constructor(rulesPackage, type, collectionKey, key) {
        super({
            rulesPackage,
            typeId: type,
            pathKeys: [collectionKey, key]
        });
    }
}
exports.NonRecursiveCollectableId = NonRecursiveCollectableId;
class RecursiveCollectableId extends CollectableId {
    constructor(rulesPackage, type, ...pathKeys) {
        super({ rulesPackage, typeId: type, pathKeys });
    }
    get recursionDepth() {
        return this.collectionAncestorKeys.length;
    }
}
exports.RecursiveCollectableId = RecursiveCollectableId;
class CollectionId extends IdParser {
    constructor(rulesPackage, type, ...pathKeys) {
        super({ rulesPackage, typeId: type, pathKeys });
    }
}
class RecursiveCollectionId extends CollectionId {
    createChild(key) {
        return new RecursiveCollectableId(this.rulesPackage, index_js_1.NodeTypeId.getCollectedBy(this.typeId), ...this.collectionAncestorKeys, this.key, key);
    }
    createCollectionChild(key) {
        if (this.pathKeys.length >= index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX)
            throw new Errors_js_1.ParseError(this.id, `Cant't generate a child collection ID because this ID has reached the maximum recursion depth (${index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX})`);
        return new RecursiveCollectionId(this.rulesPackage, this.typeId, ...this.pathKeys, key);
    }
    /**
     * @throws If a parent ID isn't possible (because this ID doesn't have a parent collection.)
     */
    getParent() {
        if (this.collectionAncestorKeys.length === 0)
            throw new Errors_js_1.ParseError(this.id, `Can't generate a parent ID because this ID has no ancestors.`);
        return new RecursiveCollectionId(this.rulesPackage, this.typeId, ...this.collectionAncestorKeys);
    }
    get recursionDepth() {
        return this.pathKeys.length;
    }
}
exports.RecursiveCollectionId = RecursiveCollectionId;
class NonRecursiveCollectionId extends CollectionId {
    createChild(key) {
        return new NonRecursiveCollectableId(this.typeId, index_js_1.NodeTypeId.getCollectedBy(this.typeId), this.key, key);
    }
}
exports.NonRecursiveCollectionId = NonRecursiveCollectionId;
