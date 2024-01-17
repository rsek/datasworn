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
var _Id_instances, _a, _Id_datasworn, _Id_resetCachedProperties, _Id_matcher, _Id_rulesPackage, _Id_typeKeys, _Id_pathKeys, _Id_path, _Id_validateKey, _Id_validateRulesPackage, _Id_validateCollectionKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecursiveCollectionId = exports.RecursiveCollectableId = exports.NonRecursiveCollectionId = exports.NonRecursiveCollectableId = exports.NonCollectableId = exports.Id = void 0;
const nanomatch_1 = __importDefault(require("nanomatch"));
const index_js_1 = require("../../IdElements/index.js");
const ObjectGlobber_js_1 = __importDefault(require("../../ObjectGlobPath/ObjectGlobber.js"));
const Errors_js_1 = require("../Errors.js");
/**
 * Creates, parses, and locates Datasworn IDs in the Datasworn tree.
 * @remarks Set the {@linkcode #datasworn} static property to provide a default value for {@link get} and {@link getMatches}
 * @example
 * // create a collectable ID valid as a child of a given collection ID
 * Id.from('my_oracles/collections/oracles/core').createChildCollectableId('theme') // returns parser subclass instance for an OracleRollable ID: 'my_oracles/oracles/core/theme'
 */
class Id {
    /**
     * @param options Options for construction of an ID.
     */
    constructor(options) {
        _Id_instances.add(this);
        _Id_matcher.set(this, null);
        _Id_rulesPackage.set(this, void 0);
        _Id_typeKeys.set(this, void 0);
        _Id_pathKeys.set(this, void 0);
        _Id_path.set(this, null);
        // this.#options = options
        __classPrivateFieldSet(this, _Id_rulesPackage, options.rulesPackage, "f");
        __classPrivateFieldSet(this, _Id_typeKeys, options.typeKeys, "f");
        __classPrivateFieldSet(this, _Id_pathKeys, options.pathKeys, "f");
        // this.#collectionKeys = options.collectionKeys
        // this.#key = options.key
    }
    /** An optional reference to the Datasworn tree object, shared by all subclasses. Used as the default value for several traversal methods. */
    static get datasworn() {
        return __classPrivateFieldGet(_a, _a, "f", _Id_datasworn);
    }
    static set datasworn(value) {
        __classPrivateFieldSet(_a, _a, value, "f", _Id_datasworn);
    }
    get id() {
        return this.elements.join(index_js_1.CONST.Sep);
    }
    get pathKeys() {
        return __classPrivateFieldGet(this, _Id_pathKeys, "f");
    }
    toString() {
        return this.id;
    }
    // valueOf(): ReturnType<this['toString']> {
    // 	return this.toString() as any
    // }
    // toJSON(): ReturnType<this['toString']> {
    // 	return this.valueOf()
    // }
    // get typeElements() {
    // 	return (
    // 		this.subtype == null ? [this.typeKeys] : [this.typeKeys, this.subtype]
    // 	) as Subtype extends null ? [Type] : [Type, Subtype]
    // }
    /** The parsed elements of the ID as an array of strings. */
    get elements() {
        return [this.rulesPackage, ...this.typeKeys, ...this.pathKeys];
    }
    get matcher() {
        if (__classPrivateFieldGet(this, _Id_matcher, "f") == null) {
            const matcher = nanomatch_1.default.matcher(this.toString());
            __classPrivateFieldSet(this, _Id_matcher, matcher, "f");
            return matcher;
        }
        return __classPrivateFieldGet(this, _Id_matcher, "f");
    }
    get rulesPackage() {
        return __classPrivateFieldGet(this, _Id_rulesPackage, "f");
    }
    set rulesPackage(value) {
        if (__classPrivateFieldGet(_a, _a, "m", _Id_validateRulesPackage).call(_a, value))
            throw new Error(`${value} is not a valid RulesPackageId or wildcard ("*").`);
        __classPrivateFieldGet(this, _Id_instances, "m", _Id_resetCachedProperties).call(this);
        __classPrivateFieldSet(this, _Id_rulesPackage, value, "f");
    }
    get typeKeys() {
        return __classPrivateFieldGet(this, _Id_typeKeys, "f");
    }
    /** The subtype element for this ID, or `null` if it has no subtype. */
    get subtype() {
        var _b;
        return (_b = this.typeKeys[1]) !== null && _b !== void 0 ? _b : null;
    }
    /** The primary type element for this ID. */
    get type() {
        return this.typeKeys[0];
    }
    /** Key elements that represent ancestor collection keys. */
    get ancestorCollectionKeys() {
        return this.pathKeys.slice(0, -1);
    }
    /** The last `pathKey` element, which represents the key for the identified object. */
    get key() {
        return this.pathKeys.at(-1);
    }
    // #collectionKeys: CollectionKeys
    // public get collectionKeys(): CollectionKeys {
    // 	return this.#collectionKeys
    // }
    // public set collectionKeys(value: CollectionKeys) {
    // 	try {
    // 		Id.#validateCollectionKeys(value, this.typeKeys, this.subtype)
    // 	} catch (err) {
    // 		throw new Error(err)
    // 	}
    // 	this.#resetCachedProperties()
    // 	this.#collectionKeys = value
    // }
    // #key: Key
    // public get key(): Key {
    // 	return this.#key
    // }
    // public set key(value: Key) {
    // 	// TODO: more specific error messages for type
    // 	if (!Id.#validateKey(value, this.isRecursive, this.isCollection))
    // 		throw new Error(`key must be a valid dictionary key or wildcard`)
    // 	this.#resetCachedProperties()
    // 	this.#key = value
    // }
    /** Does this ID contain any wildcard ("*") or globstar ("**") elements? */
    get isWildcard() {
        return this.elements.some(index_js_1.TypeGuard.AnyWildcard);
    }
    /** Does this ID contain recursive elements? */
    get isRecursive() {
        var _b;
        return ((_b = index_js_1.TypeGuard.RecursiveCollectableType(this.type)) !== null && _b !== void 0 ? _b : index_js_1.TypeGuard.RecursiveCollectableType(this.subtype));
    }
    /** Does this ID refer to a collectable object? */
    get isCollectable() {
        return index_js_1.TypeGuard.CollectableType(this.type);
    }
    /** Does this ID refer to a collection? */
    get isCollection() {
        return index_js_1.TypeGuard.CollectionType(this.type);
    }
    /** The key of the root object for this type within a RulesPackage. */
    get typeRootKey() {
        return (index_js_1.TypeGuard.CollectionType(this.type) ? this.subtype : this.type);
    }
    toPath() {
        if (__classPrivateFieldGet(this, _Id_path, "f") == null) {
            const path = _a.toPath(this);
            __classPrivateFieldSet(this, _Id_path, path, "f");
            return path;
        }
        return __classPrivateFieldGet(this, _Id_path, "f");
    }
    /**
     * Retrieves the object referenced by this ID.
     * @throws If the ID is a wildcard ID (use {@link getMatches} instead), or if the referenced object doesn't exist.
     */
    get(tree = _a.datasworn) {
        if (tree == null)
            throw new Error(`Please set the static (${_a.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`);
        if (this.isWildcard)
            throw new Error(`"${this.toString()}" is a wildcard ID. Please use ${this.constructor.name}.getMatches instead.`);
        return this.toPath().walk(tree);
    }
    /**
     * Retrieves all objects matched by this wildcard ID.
     */
    getMatches(tree = _a.datasworn) {
        if (tree == null)
            throw new Error(`Please set the static (${_a.constructor.name}.datasworn), or provide a Datasworn tree object as an argument.`);
        // non-wildcarded IDs are technically valid wildcard IDs; if this is the case, wrap it in an array and return it
        if (!this.isWildcard)
            try {
                return [this.get(tree)];
            }
            catch (_b) {
                return [];
            }
        return this.toPath().getMatches(tree, (value) => {
            if (typeof value !== 'object' || value == null)
                return false;
            if (!('id' in value))
                return false;
            const { id } = value;
            if (typeof id !== 'string')
                return false;
            return this.matcher(id);
        });
    }
    // static from<T extends Strings.AnyId>(
    // 	id: T
    // ): Id<
    // 	Utils.ExtractRulesPackage<T>,
    // 	Utils.ExtractTypeElements<T>,
    // 	Utils.ExtractPathKeys<T>
    // > & { id: T }
    /**
     * Create an Id parser instance of the appropriate subclass from a string ID.
     * @throws If `id` is invalid.
     */
    static from(id) {
        const { rulesPackage, typeKeys, pathKeys } = _a.parse(id);
        const [type, subtype] = typeKeys;
        switch (true) {
            case index_js_1.TypeGuard.NonCollectableType(type):
                return new NonCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.NonRecursiveCollectableType(type):
                return new NonRecursiveCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.RecursiveCollectableType(type):
                return new RecursiveCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.CollectionType(type) &&
                index_js_1.TypeGuard.RecursiveCollectableType(subtype):
                return new RecursiveCollectionId(rulesPackage, subtype, ...pathKeys);
            case index_js_1.TypeGuard.CollectionType(type) &&
                index_js_1.TypeGuard.NonRecursiveCollectableType(subtype):
                return new NonRecursiveCollectionId(rulesPackage, subtype, ...pathKeys);
            default:
                throw new Errors_js_1.ParseError(id, `Couldn't parse ID into a recognized subclass`);
        }
    }
    static get(id, tree = __classPrivateFieldGet(_a, _a, "f", _Id_datasworn)) {
        const parsedId = id instanceof _a ? id : _a.from(id);
        return parsedId.toPath().walk(tree);
    }
    static toString({ rulesPackage, typeKeys, pathKeys }) {
        return [rulesPackage, ...typeKeys, ...pathKeys].join(index_js_1.CONST.Sep);
    }
    static parse(id) {
        const [rulesPackage, primaryType, ...pathKeys] = id.split(index_js_1.CONST.Sep);
        // ) as [ExtractRulesPackageId<Id>, AnyPrimary, ...DictKey[]]
        // validate first element (rules package id)
        if (!index_js_1.TypeGuard.RulesPackageId(rulesPackage) &&
            !index_js_1.TypeGuard.Wildcard(rulesPackage))
            throw new Errors_js_1.ParseError(id, `"${String(rulesPackage)}" is not a valid Datasworn package ID.`);
        // validate second element (primary type)
        if (!index_js_1.TypeGuard.AnyType(primaryType))
            throw new Errors_js_1.ParseError(id, `"${primaryType}" is not a valid Datasworn type.`);
        const result = {
            rulesPackage,
            pathKeys,
            typeKeys: [primaryType]
        };
        // if it's a collection, validate the next element as the collection subtype
        if (index_js_1.TypeGuard.CollectionType(primaryType)) {
            const subtype = result.pathKeys.shift();
            if (!index_js_1.TypeGuard.CollectableType(subtype))
                throw new Errors_js_1.ParseError(id, `"${subtype}" not a valid Datasworn collectable type.`);
            result.typeKeys.push(subtype);
        }
        // ensure that any remaining collectionKeys are the correct length
        let min, max;
        switch (true) {
            case index_js_1.TypeGuard.NonRecursiveCollectableType(primaryType):
                min = max = 2;
                break;
            case index_js_1.TypeGuard.RecursiveCollectableType(primaryType):
                min = 2;
                max = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX + 1;
                break;
            case index_js_1.TypeGuard.RecursiveCollectionSubtype(result.typeKeys):
                min = 1;
                max = index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX;
                break;
            default:
                min = max = 1;
        }
        if (result.pathKeys.length > max || result.pathKeys.length < min)
            throw new Errors_js_1.ParseError(id, `Expected ${min === max ? min : `${min}-${max}`} path elements before the key, but got ${result.pathKeys.length}`);
        // validate ancestor collection keys
        const isCollection = index_js_1.TypeGuard.CollectionType(primaryType);
        const isRecursive = index_js_1.TypeGuard.RecursiveCollectableType(primaryType) ||
            index_js_1.TypeGuard.RecursiveCollectionSubtype(result.typeKeys);
        const badCollectionKeys = result.pathKeys.filter((key) => !__classPrivateFieldGet(this, _a, "m", _Id_validateCollectionKey).call(this, key, isRecursive));
        if (badCollectionKeys.length > 0)
            throw new Errors_js_1.ParseError(id, `Received invalid ancestor collection keys: ${JSON.stringify(badCollectionKeys)}`);
        // ensure that only recursive collections have a globstar (**) in the last pathKey position
        if (index_js_1.TypeGuard.Globstar(result.pathKeys.at(-1)) &&
            !(isCollection && isRecursive))
            throw new Errors_js_1.ParseError(id, `Received a recursive wildcard as a key for a non-recursive collection type`);
        return result;
    }
    static fromOptions(options) {
        const { rulesPackage, typeKeys, pathKeys } = options;
        const [type, subtype] = typeKeys;
        switch (true) {
            case index_js_1.TypeGuard.NonCollectableType(type):
                return new NonCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.NonRecursiveCollectableType(type):
                return new NonRecursiveCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.RecursiveCollectableType(type):
                return new RecursiveCollectableId(rulesPackage, type, ...pathKeys);
            case index_js_1.TypeGuard.CollectionType(type) &&
                index_js_1.TypeGuard.RecursiveCollectableType(subtype):
                return new RecursiveCollectionId(rulesPackage, subtype, ...pathKeys);
            case index_js_1.TypeGuard.CollectionType(type) &&
                index_js_1.TypeGuard.NonRecursiveCollectableType(subtype):
                return new NonRecursiveCollectionId(rulesPackage, subtype, ...pathKeys);
            default:
                throw new Errors_js_1.ParseError(_a.toString(options), `Parsed ID doesn't belong to a known ID type, and can't be assigned a subclass.`);
        }
    }
    static toPath(options) {
        const id = options instanceof _a
            ? options
            : typeof options === 'string'
                ? _a.from(options)
                : _a.fromOptions(options);
        const dotPathElements = [];
        // e.g. "starforged"
        dotPathElements.push(id.rulesPackage);
        // e.g. "starforged.oracles"
        dotPathElements.push(id.typeRootKey);
        if (id.ancestorCollectionKeys.length > 0) {
            console.log(id.ancestorCollectionKeys);
            const [rootAncestor, ...ancestors] = id.ancestorCollectionKeys;
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
            if (id.isCollection)
                dotPathElements.push(index_js_1.CONST.CollectionsKey);
            else if (id.isCollectable)
                dotPathElements.push(index_js_1.CONST.ContentsKey);
        }
        dotPathElements.push(id.key);
        return new ObjectGlobber_js_1.default(...dotPathElements);
    }
}
exports.Id = Id;
_a = Id, _Id_matcher = new WeakMap(), _Id_rulesPackage = new WeakMap(), _Id_typeKeys = new WeakMap(), _Id_pathKeys = new WeakMap(), _Id_path = new WeakMap(), _Id_instances = new WeakSet(), _Id_resetCachedProperties = function _Id_resetCachedProperties() {
    __classPrivateFieldSet(this, _Id_matcher, null, "f");
    __classPrivateFieldSet(this, _Id_path, null, "f");
}, _Id_validateKey = function _Id_validateKey(key, recursive = false, collection = false) {
    if (recursive && collection)
        index_js_1.TypeGuard.AnyWildcard(key) || index_js_1.TypeGuard.DictKey(key);
    return index_js_1.TypeGuard.Wildcard(key) || index_js_1.TypeGuard.DictKey(key);
}, _Id_validateRulesPackage = function _Id_validateRulesPackage(key) {
    return index_js_1.TypeGuard.RulesPackageId(key) || index_js_1.TypeGuard.Wildcard(key);
}, _Id_validateCollectionKey = function _Id_validateCollectionKey(key, recursive = false) {
    return recursive
        ? index_js_1.TypeGuard.Globstar(key) || __classPrivateFieldGet(this, _a, "m", _Id_validateKey).call(this, key)
        : __classPrivateFieldGet(this, _a, "m", _Id_validateKey).call(this, key);
};
_Id_datasworn = { value: null };
class CollectionId extends Id {
    constructor(rulesPackage, subtype, ...pathKeys) {
        super({
            rulesPackage,
            typeKeys: [index_js_1.TypeElements.Collection, subtype],
            pathKeys
        });
    }
}
class CollectableId extends Id {
    constructor(rulesPackage, type, ...pathKeys) {
        super({
            rulesPackage,
            typeKeys: [type],
            pathKeys
        });
    }
}
/**
 * Represents an ID for a non-collectable Datasworn object (a {@link Truth}, {@link DelveSite}, {@link DelveSiteTheme}, {@link DelveSiteDomain}, or {@link Rarity}).
 */
class NonCollectableId extends Id {
    constructor(rulesPackage, type, key) {
        super({ rulesPackage, typeKeys: [type], pathKeys: [key] });
    }
}
exports.NonCollectableId = NonCollectableId;
const f = new NonCollectableId('*', 'rarities', '*');
console.log(f.toPath()); /**
 * Represents an ID for a {@link Move} or {@link Asset}
 */
class NonRecursiveCollectableId extends CollectableId {
    getParentCollectionId() {
        const result = new NonRecursiveCollectionId(this.rulesPackage, this.type, ...this.ancestorCollectionKeys);
        return result;
    }
}
exports.NonRecursiveCollectableId = NonRecursiveCollectableId;
/** Represents an ID for a {@link MoveCategory} or {@link AssetCollection} */
class NonRecursiveCollectionId extends CollectionId {
    createChildCollectableId(key) {
        return new NonRecursiveCollectableId(this.rulesPackage, this.subtype, this.key, key);
    }
}
exports.NonRecursiveCollectionId = NonRecursiveCollectionId;
class RecursiveCollectableId extends CollectableId {
    getParentCollectionId() {
        return new RecursiveCollectionId(this.rulesPackage, this.type, ...this.ancestorCollectionKeys);
    }
}
exports.RecursiveCollectableId = RecursiveCollectableId;
/**
 * Represents an ID for a {@link OracleCollection}, {@link NpcCollection}, or {@link Atlas}
 */
class RecursiveCollectionId extends CollectionId {
    createChildCollectableId(childKey) {
        const result = new RecursiveCollectableId(this.rulesPackage, this.subtype, ...this.pathKeys, childKey);
        return result;
    }
    /**
     * Create an ID to represent a child collection of this recursive collection ID.
     * @param childKey The key to use for the child collection.
     * @returns A new IdParser instance for the child collection ID.
     * @throws If this collection has already reached its maximum recursion depth (3).
     * @example
     * ```typescript
     * const collectionId = new IdParser('starforged/collections/oracles/planets')
     * const childCollectionId = collectionId.createChildCollectionId('furnace')
     * console.log(childCollectionId.id) // "starforged/collections/oracles/planets/furnace"
     * ```
     */
    createChildCollectionId(childKey) {
        if (this.pathKeys.length >= index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX)
            throw new Error(`Child collection would have a recursion depth of ${this.pathKeys.length + 1} (max is ${index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX})`);
        return new RecursiveCollectionId(this.rulesPackage, this.subtype, ...this.pathKeys, childKey);
    }
    /**
     * Returns a new {@link RecursiveCollectionId} instance for the ID of this object's parent RecursiveCollection, if one exists.
     */
    getParentCollectionId() {
        if (this.ancestorCollectionKeys.length === 0)
            return null;
        const result = new RecursiveCollectionId(this.rulesPackage, this.subtype, ...this.ancestorCollectionKeys);
        return result;
    }
    get canHaveCollectionChild() {
        return (this.ancestorCollectionKeys.length >=
            index_js_1.CONST.RECURSIVE_PATH_ELEMENTS_MAX);
    }
}
exports.RecursiveCollectionId = RecursiveCollectionId;
