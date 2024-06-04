"use strict";
/**
 * Type guards for individual elements of Datasworn IDs.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pattern_js_1 = __importDefault(require("./Pattern.js"));
const CONST_js_1 = __importDefault(require("./CONST.js"));
const NodeTypeId_js_1 = __importDefault(require("./NodeTypeId.js"));
var TypeGuard;
(function (TypeGuard) {
    function DictKey(value) {
        return typeof value === 'string' && Pattern_js_1.default.DictKey.test(value);
    }
    TypeGuard.DictKey = DictKey;
    function RulesPackageId(value) {
        return typeof value === 'string' && Pattern_js_1.default.RulesPackageId.test(value);
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
    function RecursiveCollectionType(value) {
        for (const v of NodeTypeId_js_1.default.Collection.Recursive)
            if (v === value)
                return true;
        return false;
    }
    TypeGuard.RecursiveCollectionType = RecursiveCollectionType;
    function NonRecursiveCollectionType(value) {
        for (const v of NodeTypeId_js_1.default.Collection.NonRecursive)
            if (v === value)
                return true;
        return false;
    }
    TypeGuard.NonRecursiveCollectionType = NonRecursiveCollectionType;
    function CollectionType(value) {
        return RecursiveCollectionType(value) || NonRecursiveCollectionType(value);
    }
    TypeGuard.CollectionType = CollectionType;
    function NonCollectableType(value) {
        for (const v of NodeTypeId_js_1.default.NonCollectable)
            if (v === value)
                return true;
        return false;
    }
    TypeGuard.NonCollectableType = NonCollectableType;
    function RecursiveCollectableType(value) {
        for (const v of NodeTypeId_js_1.default.Collectable.Recursive)
            if (v === value)
                return true;
        return false;
    }
    TypeGuard.RecursiveCollectableType = RecursiveCollectableType;
    function NonRecursiveCollectableType(value) {
        for (const v of NodeTypeId_js_1.default.Collectable.NonRecursive)
            if (v === value)
                return true;
        return false;
    }
    TypeGuard.NonRecursiveCollectableType = NonRecursiveCollectableType;
    function CollectableType(value) {
        return RecursiveCollectableType(value) || NonRecursiveCollectableType(value);
    }
    TypeGuard.CollectableType = CollectableType;
    function AnyType(value) {
        return (NonCollectableType(value) ||
            CollectableType(value) ||
            CollectionType(value));
    }
    TypeGuard.AnyType = AnyType;
})(TypeGuard || (TypeGuard = {}));
exports.default = TypeGuard;
