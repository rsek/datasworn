"use strict";
/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Regex_js_1 = __importDefault(require("./Regex.js"));
const CONST_js_1 = __importDefault(require("./CONST.js"));
const TypeElements_js_1 = __importDefault(require("./TypeElements.js"));
var TypeGuard;
(function (TypeGuard) {
    function DictKey(value) {
        return typeof value === 'string' && Regex_js_1.default.DictKey.test(value);
    }
    TypeGuard.DictKey = DictKey;
    function RulesPackageId(value) {
        return typeof value === 'string' && Regex_js_1.default.RulesPackageId.test(value);
    }
    TypeGuard.RulesPackageId = RulesPackageId;
    function Wildcard(value) {
        return value === CONST_js_1.default.WildcardString;
    }
    TypeGuard.Wildcard = Wildcard;
    function Globstar(value) {
        return value === CONST_js_1.default.GlobstarString;
    }
    TypeGuard.Globstar = Globstar;
    function AnyWildcard(value) {
        return Wildcard(value) || Globstar(value);
    }
    TypeGuard.AnyWildcard = AnyWildcard;
    function CollectionType(value) {
        return value === TypeElements_js_1.default.Collection;
    }
    TypeGuard.CollectionType = CollectionType;
    function NonCollectableType(value) {
        return TypeElements_js_1.default.NonCollectable.includes(value);
    }
    TypeGuard.NonCollectableType = NonCollectableType;
    function CollectionSubtype(typeTuple) {
        const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2;
        if (!isTuple)
            return false;
        const [collectionType, subtype] = typeTuple;
        return CollectionType(collectionType) && CollectableType(subtype);
    }
    TypeGuard.CollectionSubtype = CollectionSubtype;
    function RecursiveCollectionSubtype(typeTuple) {
        const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2;
        if (!isTuple)
            return false;
        const [collectionType, subtype] = typeTuple;
        return CollectionType(collectionType) && RecursiveCollectableType(subtype);
    }
    TypeGuard.RecursiveCollectionSubtype = RecursiveCollectionSubtype;
    function NonRecursiveCollectionSubtype(typeTuple) {
        const isTuple = Array.isArray(typeTuple) && typeTuple.length === 2;
        if (!isTuple)
            return false;
        const [collectionType, subtype] = typeTuple;
        return (CollectionType(collectionType) && NonRecursiveCollectableType(subtype));
    }
    TypeGuard.NonRecursiveCollectionSubtype = NonRecursiveCollectionSubtype;
    function CollectableType(value) {
        return TypeElements_js_1.default.Collectable.Any.includes(value);
    }
    TypeGuard.CollectableType = CollectableType;
    function AnyType(value) {
        return (NonCollectableType(value) ||
            CollectableType(value) ||
            CollectionType(value));
    }
    TypeGuard.AnyType = AnyType;
    function RecursiveCollectableType(value) {
        return TypeElements_js_1.default.Collectable.Recursive.includes(value);
    }
    TypeGuard.RecursiveCollectableType = RecursiveCollectableType;
    function NonRecursiveCollectableType(value) {
        return TypeElements_js_1.default.Collectable.NonRecursive.includes(value);
    }
    TypeGuard.NonRecursiveCollectableType = NonRecursiveCollectableType;
})(TypeGuard || (TypeGuard = {}));
exports.default = TypeGuard;
