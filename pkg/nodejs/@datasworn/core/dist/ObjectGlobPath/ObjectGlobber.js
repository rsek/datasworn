"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _ObjectGlobber_getPlainObjectPaths, _ObjectGlobber_getMapPaths;
Object.defineProperty(exports, "__esModule", { value: true });
const arrayIs_js_1 = require("./arrayIs.js");
const CONST_js_1 = __importDefault(require("../IdElements/CONST.js"));
const TypeGuard_js_1 = __importDefault(require("../IdElements/TypeGuard.js"));
// TODO: make this friendly to lookups in Map objects.
/**
 * @internal
 */
class ObjectGlobber extends Array {
    constructor(...items) {
        super(...items.map(_a.replaceGlobString));
    }
    /** Does this path contain any wildcard or globstar elements? */
    get wildcard() {
        return this.some(_a.isGlobElement);
    }
    toJSON() {
        return this.map(_a.replaceGlobSymbol);
    }
    clone() {
        return new _a(...this);
    }
    partitionStaticPath() {
        if (!this.wildcard)
            return [this.clone(), new _a()];
        const firstGlobIndex = this.findIndex(_a.isGlobElement);
        return [
            new _a(...this.slice(0, firstGlobIndex)),
            new _a(...this.slice(firstGlobIndex))
        ];
    }
    nearestStaticPath() {
        if (!this.wildcard)
            return this;
        const pathElements = new _a();
        for (const element of this) {
            if (element === _a.WILDCARD ||
                element === _a.GLOBSTAR)
                break;
            else
                pathElements.push(element);
        }
        return pathElements;
    }
    step(steps = 1) {
        if (steps < 0)
            throw new Error("steps parameter can't be less than 0");
        return new _a(...this.slice(1));
    }
    getParent() {
        return new _a(...this.slice(0, this.length - 1));
    }
    getMatches(from, matchTest, matches = [], includeArrays = false) {
        if (!this.wildcard) {
            const match = this.walk(from);
            if ((typeof matchTest === 'function' &&
                matchTest(match, this.last(), this.last())) ||
                !matchTest)
                matches.push(match);
            // else matches.push(match)
            return matches;
        }
        matches.push(..._a.getMatches(from, this, { includeArrays, matchTest }));
        return matches;
    }
    walk(from, forEach) {
        if (this.wildcard)
            throw new Error(`Path contains wildcard/globstar elements. Use ${this.constructor.name}#${this.getMatches.name} instead.`);
        return _a.walk(from, this, forEach);
    }
    is(path) {
        if (path instanceof _a)
            return false;
        return this.every((valueA, i) => {
            const valueB = path[i];
            if (Array.isArray(valueA) && Array.isArray(valueB))
                return (0, arrayIs_js_1.arrayIs)(valueA, valueB);
            return Object.is(valueA, valueB);
        });
    }
    static isGlobElement(element) {
        return (element === _a.WILDCARD || element === _a.GLOBSTAR);
    }
    first() {
        return this[0];
    }
    last() {
        return this[this.length - 1];
    }
    head() {
        return this.slice(1);
    }
    tail() {
        return this.slice(0, -1);
    }
    static getMatches(from, keys, { matchTest, includeArrays = false } = { includeArrays: false }) {
        const nextKey = keys[0];
        const nextPath = keys.slice(1);
        // console.log('next:', nextKey, nextPath)
        if (nextPath.length === 0)
            return this.getKeyMatches(from, nextKey, { includeArrays, matchTest });
        const matches = this.getKeyMatches(from, nextKey, {
            includeArrays
        });
        const results = [];
        for (const match of matches) {
            results.push(...this.getMatches(match, nextPath, {
                matchTest,
                includeArrays
            }));
        }
        return results;
    }
    static getKeyMatches(from, matchKey, { forEachMatch, matchTest, includeArrays = false } = {
        includeArrays: false
    }) {
        if (!this.isPropertyKey(matchKey))
            throw new Error(`Expected a number, string, or symbol key, but got ${typeof matchKey}`);
        const results = [];
        const hasMatchTest = typeof matchTest === 'function';
        function iterateWildcardMatch(key, value, results) {
            if (!hasMatchTest || matchTest(value, key, matchKey))
                results.push(value);
        }
        function iterateGlobstarMatch(key, value, results) {
            iterateWildcardMatch(key, value, results);
            if (this.isWalkable(value, includeArrays)) {
                results.push(...this.getKeyMatches(value, matchKey, {
                    matchTest,
                    includeArrays
                }));
            }
        }
        switch (matchKey) {
            case _a.WILDCARD.description:
            case _a.WILDCARD:
                if (from instanceof Map) {
                    for (const [key, value] of from)
                        iterateWildcardMatch(key, value, results);
                }
                else
                    for (const key in from) {
                        if (!Object.hasOwn(from, key))
                            continue;
                        const value = from[key];
                        iterateWildcardMatch(key, value, results);
                    }
                break;
            case _a.GLOBSTAR.description:
            case _a.GLOBSTAR:
                if (from instanceof Map) {
                    for (const [key, value] of from)
                        iterateGlobstarMatch(key, value, results);
                }
                else
                    for (const key in from) {
                        // console.log(realKey)
                        if (!Object.hasOwn(from, key))
                            continue;
                        const value = from[key];
                        iterateGlobstarMatch(key, value, results);
                    }
                break;
            default: {
                let value;
                if (from instanceof Map)
                    value = from.get(matchKey);
                else
                    value = from[matchKey];
                if (typeof value === 'undefined')
                    throw new Error(`Unable to find key ${typeof matchKey === 'symbol'
                        ? matchKey.toString()
                        : JSON.stringify(matchKey)}`);
                results.push(value);
                break;
            }
        }
        return results;
    }
    /** Is this value an object with recursable keys? */
    static isWalkable(value, includeArrays = false) {
        if (!includeArrays && Array.isArray(value))
            return false;
        return typeof value === 'object' && !Object.is(value, null);
    }
    /** Is the value valid as an object property key? */
    static isPropertyKey(key) {
        return (typeof key === 'string' ||
            typeof key === 'number' ||
            typeof key === 'symbol');
    }
    static walk(from, path, forEach) {
        if (path.length === 0)
            return from;
        if (typeof forEach === 'function')
            forEach(from, path);
        const [currentKey, ...nextPath] = path;
        if (!this.isPropertyKey(currentKey))
            throw new Error(`Expected a number, string, or symbol key, but got ${typeof currentKey}`);
        if (typeof from !== 'object')
            throw new Error(`Expected an object but got ${typeof from}`);
        if (from == null)
            throw new Error(`Expected an object but got ${JSON.stringify(from)}`);
        let nextObject;
        if (Array.isArray(from)) {
            const currentIndex = Number(currentKey);
            if (!Number.isInteger(currentIndex))
                throw new Error(`Expected an array index but got ${currentIndex}`);
            nextObject = from[currentIndex];
        }
        else if (from instanceof Map) {
            nextObject = from.get(currentKey);
        }
        else
            nextObject = from[currentKey];
        if (path.length === 0)
            return nextObject;
        else
            return _a.walk(nextObject, nextPath);
    }
    /** Return all object paths in a given object. Paths that contain only a primitive value (boolean, number, string) are omitted. */
    static getObjectPaths(object, includeArrays = false, currentPath = new _a()) {
        const results = [];
        if (object instanceof Map)
            results.push(...__classPrivateFieldGet(this, _a, "m", _ObjectGlobber_getMapPaths).call(this, object, includeArrays, currentPath));
        else
            results.push(...__classPrivateFieldGet(this, _a, "m", _ObjectGlobber_getPlainObjectPaths).call(this, object, includeArrays, currentPath));
        return results;
    }
    /** Replace a wildcard/globstar string with a Symbol */
    static replaceGlobString(item) {
        switch (true) {
            case TypeGuard_js_1.default.Wildcard(item):
                return _a.WILDCARD;
            case TypeGuard_js_1.default.Globstar(item):
                return _a.GLOBSTAR;
            default:
                return item;
        }
    }
    /** Replace a wildcard or globstar Symbol with a string representation. */
    static replaceGlobSymbol(item) {
        switch (item) {
            case _a.WILDCARD:
            case _a.GLOBSTAR:
                return item.description();
            default:
                return item;
        }
    }
}
_a = ObjectGlobber, _ObjectGlobber_getPlainObjectPaths = function _ObjectGlobber_getPlainObjectPaths(object, includeArrays = false, currentPath = new _a()) {
    const results = [];
    for (const k in object) {
        if (!Object.hasOwn(object, k))
            continue;
        const nextObject = object[k];
        if (typeof nextObject !== 'object')
            continue;
        if (Object.is(nextObject, null))
            continue;
        if (!includeArrays && Array.isArray(nextObject))
            continue;
        const nextPath = new _a(...currentPath, k);
        results.push(nextPath, ...this.getObjectPaths(nextObject, includeArrays, nextPath));
    }
    return results;
}, _ObjectGlobber_getMapPaths = function _ObjectGlobber_getMapPaths(object, includeArrays = false, currentPath = new _a()) {
    const results = [];
    for (const [k, nextObject] of object) {
        if (typeof nextObject !== 'object')
            continue;
        if (Object.is(nextObject, null))
            continue;
        if (!includeArrays && Array.isArray(nextObject))
            continue;
        const nextPath = new _a(...currentPath, k);
        results.push(nextPath, ...this.getObjectPaths(nextObject, includeArrays, nextPath));
    }
    return results;
};
(function (ObjectGlobber) {
    /** Represents a glob wildcard path element, usually expressed as `*` */
    ObjectGlobber.WILDCARD = Symbol(CONST_js_1.default.WildcardString);
    /** Represents a globstar (recursive wildcard) path element, usually expressed as `**` */
    ObjectGlobber.GLOBSTAR = Symbol(CONST_js_1.default.GlobstarString);
})(ObjectGlobber || (ObjectGlobber = {}));
exports.default = ObjectGlobber;
