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
var _RulesPackageBuilder_instances, _a, _RulesPackageBuilder_result, _RulesPackageBuilder_isSorted, _RulesPackageBuilder_isMergeComplete, _RulesPackageBuilder_isValidated, _RulesPackageBuilder_countTypes, _RulesPackageBuilder_build, _RulesPackageBuilder_sortKeys, _RulesPackageBuilder_addFile, _RulesPackageBuilder_isObject, _RulesPackageBuilder_merge, _RulesPackagePart_data, _RulesPackagePart_isValidated;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesPackageBuilder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const CONST_js_1 = __importDefault(require("../IdElements/CONST.js"));
const Sort_js_1 = require("../Utils/Sort.js");
const Text_js_1 = require("../Validators/Text.js");
const index_js_1 = __importDefault(require("../Validators/index.js"));
const index_js_2 = require("../index.js");
/**
    * Merges, assigns IDs to, and validates multiple {@link DataswornSource.RulesPackage}s to create a complete {@link Datasworn.RulesPackage} object.
    * */
class RulesPackageBuilder {
    mergeFiles(force = false) {
        if (!force && __classPrivateFieldGet(this, _RulesPackageBuilder_isMergeComplete, "f"))
            return this;
        const sortedEntries = Array.from(this.files)
            // sort by file name so that they merge in the same order every time (prevents JSON diff noise). the order itself is arbitrary, but must be the same no matter who runs it -- this is why localeCompare specifies a static locale
            .sort(([a], [b]) => a.localeCompare(b, 'en-US'));
        for (const [_, part] of sortedEntries)
            __classPrivateFieldGet(this, _RulesPackageBuilder_instances, "m", _RulesPackageBuilder_merge).call(this, __classPrivateFieldGet(this, _RulesPackageBuilder_result, "f"), part.data);
        __classPrivateFieldSet(this, _RulesPackageBuilder_isMergeComplete, true, "f");
        __classPrivateFieldSet(this, _RulesPackageBuilder_isValidated, false, "f");
        __classPrivateFieldSet(this, _RulesPackageBuilder_isSorted, false, "f");
        return this;
    }
    toJSON() {
        return __classPrivateFieldGet(this, _RulesPackageBuilder_result, "f");
    }
    validate(force = false) {
        if (!force && __classPrivateFieldGet(this, _RulesPackageBuilder_isValidated, "f"))
            return this;
        this.schemaValidator(__classPrivateFieldGet(this, _RulesPackageBuilder_result, "f"));
        const validatedIds = new Set();
        for (const [id, typeNode] of this.index) {
            if (typeNode == null)
                continue;
            if (validatedIds.has(id))
                continue;
            if (!__classPrivateFieldGet(_a, _a, "m", _RulesPackageBuilder_isObject).call(_a, typeNode))
                continue;
            if (!('type' in typeNode))
                continue;
            if (typeNode.type == null || typeof typeNode.type !== 'string')
                continue;
            const typeValidation = _a.postSchemaValidators[typeNode.type];
            if (typeof typeValidation !== 'function')
                continue;
            try {
                typeValidation(typeNode);
                validatedIds.add(id);
            }
            catch (e) {
                throw new Error(`<${id}> ${String(e)}\n\n${JSON.stringify(typeNode, undefined, '\t')}`);
            }
        }
        __classPrivateFieldSet(this, _RulesPackageBuilder_isValidated, true, "f");
        return this;
    }
    validateIdPointers(index) {
        return (0, Text_js_1.validateIdsInStrings)(__classPrivateFieldGet(this, _RulesPackageBuilder_result, "f"), index);
    }
    build(force = false) {
        try {
            __classPrivateFieldGet(this, _RulesPackageBuilder_instances, "m", _RulesPackageBuilder_build).call(this, force);
            this.validate(force);
            return this;
        }
        catch (e) {
            fs_extra_1.default.writeJSONSync(`datasworn/${this.id}/error_build.json`, this.toJSON(), {
                spaces: '\t'
            });
            throw new Error(`Couldn't build "${this.id}". ${String(e)}`);
        }
    }
    static sortDataswornKeys(object, sortOrder = Sort_js_1.dataswornKeyOrder) {
        return (0, Sort_js_1.sortObjectKeys)(object, sortOrder);
    }
    /**
     *
     * @param id The `_id` of the RulesPackage to be constructed.
     * @param validator A function that validates the completed RulesPackage against the Datasworn JSON schema.
     * @param sourceValidator A function that validates the individual package file contents against the DataswornSource JSON schema.
     * @param logger The destination for logging build messages.
     */
    constructor(id, validator, sourceValidator, logger) {
        _RulesPackageBuilder_instances.add(this);
        this.files = new Map();
        this.index = new Map();
        _RulesPackageBuilder_result.set(this, {});
        _RulesPackageBuilder_isSorted.set(this, false);
        _RulesPackageBuilder_isMergeComplete.set(this, false);
        _RulesPackageBuilder_isValidated.set(this, false);
        this.id = id;
        this.schemaValidator = validator;
        this.sourceSchemaValidator = sourceValidator;
        this.logger = logger;
    }
    addFiles(...files) {
        for (const file of files)
            try {
                void __classPrivateFieldGet(this, _RulesPackageBuilder_instances, "m", _RulesPackageBuilder_addFile).call(this, file);
            }
            catch (e) {
                throw new Error(`Failed to add "${file.name}"! ${String(e)}`);
            }
        return this;
    }
}
exports.RulesPackageBuilder = RulesPackageBuilder;
_a = RulesPackageBuilder, _RulesPackageBuilder_result = new WeakMap(), _RulesPackageBuilder_isSorted = new WeakMap(), _RulesPackageBuilder_isMergeComplete = new WeakMap(), _RulesPackageBuilder_isValidated = new WeakMap(), _RulesPackageBuilder_instances = new WeakSet(), _RulesPackageBuilder_countTypes = function _RulesPackageBuilder_countTypes() {
    const types = {};
    for (const [id, _] of this.index) {
        const [fullTypeId, ..._path] = id.split(CONST_js_1.default.PrefixSep);
        types[fullTypeId] || (types[fullTypeId] = 0);
        types[fullTypeId]++;
    }
    // display using console.table or similar?
    return types;
}, _RulesPackageBuilder_build = function _RulesPackageBuilder_build(force = false) {
    this.mergeFiles(force);
    __classPrivateFieldSet(this, _RulesPackageBuilder_isValidated, false, "f");
    __classPrivateFieldGet(this, _RulesPackageBuilder_instances, "m", _RulesPackageBuilder_sortKeys).call(this, force);
    return __classPrivateFieldGet(this, _RulesPackageBuilder_result, "f");
}, _RulesPackageBuilder_sortKeys = function _RulesPackageBuilder_sortKeys(force = false) {
    if (__classPrivateFieldGet(this, _RulesPackageBuilder_isSorted, "f") && !force)
        return this;
    __classPrivateFieldSet(this, _RulesPackageBuilder_result, (0, Sort_js_1.sortDataswornKeys)(__classPrivateFieldGet(this, _RulesPackageBuilder_result, "f")), "f");
    __classPrivateFieldSet(this, _RulesPackageBuilder_isSorted, true, "f");
    return this;
}, _RulesPackageBuilder_addFile = function _RulesPackageBuilder_addFile(file) {
    const fileToAdd = file instanceof RulesPackagePart
        ? file
        : new RulesPackagePart(file, this.sourceSchemaValidator, this.logger);
    this.files.set(fileToAdd.name, fileToAdd);
    return this;
}, _RulesPackageBuilder_isObject = function _RulesPackageBuilder_isObject(value) {
    return value != null && typeof value === 'object' && !Array.isArray(value);
}, _RulesPackageBuilder_merge = function _RulesPackageBuilder_merge(target, ...sources) {
    if (!sources.length) {
        // nothing left to add, so index it
        if (__classPrivateFieldGet(_a, _a, "m", _RulesPackageBuilder_isObject).call(_a, target) && '_id' in target)
            this.index.set(target._id, target);
        return target;
    }
    const source = sources.shift();
    if (__classPrivateFieldGet(_a, _a, "m", _RulesPackageBuilder_isObject).call(_a, target) &&
        __classPrivateFieldGet(_a, _a, "m", _RulesPackageBuilder_isObject).call(_a, source)) {
        for (const k in source) {
            const key = k;
            if (__classPrivateFieldGet(_a, _a, "m", _RulesPackageBuilder_isObject).call(_a, source[key])) {
                if (typeof target[key] === 'undefined')
                    Object.assign(target, { [key]: {} });
                __classPrivateFieldGet(this, _RulesPackageBuilder_instances, "m", _RulesPackageBuilder_merge).call(this, target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return __classPrivateFieldGet(this, _RulesPackageBuilder_instances, "m", _RulesPackageBuilder_merge).call(this, target, ...sources);
};
RulesPackageBuilder.postSchemaValidators = index_js_1.default;
/** Top-level RulesPackage properties to omit from key sorting. */
RulesPackageBuilder.topLevelKeysBlackList = [
    'rules'
];
/** Separator character used for JSON pointers. */
RulesPackageBuilder.pointerSep = '/';
/** Hash character that prepends generated JSON pointers. */
RulesPackageBuilder.hashChar = '#';
class RulesPackagePart {
    get data() {
        return __classPrivateFieldGet(this, _RulesPackagePart_data, "f");
    }
    set data(value) {
        __classPrivateFieldSet(this, _RulesPackagePart_data, value, "f");
        __classPrivateFieldSet(this, _RulesPackagePart_isValidated, false, "f");
    }
    get isValidated() {
        return __classPrivateFieldGet(this, _RulesPackagePart_isValidated, "f");
    }
    validate() {
        const result = this.validator(this.data);
        __classPrivateFieldSet(this, _RulesPackagePart_isValidated, true, "f");
        return result;
    }
    constructor({ data, name }, validator, logger) {
        this.index = new Map();
        _RulesPackagePart_data.set(this, void 0);
        _RulesPackagePart_isValidated.set(this, false);
        this.name = name;
        this.logger = logger;
        this.validator = validator;
        __classPrivateFieldSet(this, _RulesPackagePart_data, data, "f");
        this.init();
    }
    init() {
        const isValid = this.validate();
        if (!isValid)
            throw new Error(`${this.name} doesn't match DataswornSource`);
        void index_js_2.IdParser.assignIdsInRulesPackage(this.data, this.index);
    }
}
_RulesPackagePart_data = new WeakMap(), _RulesPackagePart_isValidated = new WeakMap();
