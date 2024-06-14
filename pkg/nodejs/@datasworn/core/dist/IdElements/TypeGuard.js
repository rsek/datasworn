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
const TypeId_js_1 = __importDefault(require("./TypeId.js"));
var TypeGuard;
(function (TypeGuard) {
    function IndexKey(value) {
        const integer = Number.parseInt(value, 10);
        return Number.isInteger(integer) && integer >= 0;
    }
    TypeGuard.IndexKey = IndexKey;
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
    function CollectionType(value) {
        return TypeId_js_1.default.Collection.includes(value);
    }
    TypeGuard.CollectionType = CollectionType;
    function NonCollectableType(value) {
        return TypeId_js_1.default.NonCollectable.includes(value);
    }
    TypeGuard.NonCollectableType = NonCollectableType;
    function CollectableType(value) {
        return TypeId_js_1.default.Collectable.includes(value);
    }
    TypeGuard.CollectableType = CollectableType;
    function EmbedOnlyType(value) {
        return TypeId_js_1.default.EmbedOnlyType.includes(value);
    }
    TypeGuard.EmbedOnlyType = EmbedOnlyType;
    function EmbeddablePrimaryType(value) {
        return TypeId_js_1.default.EmbeddablePrimaryType.includes(value);
    }
    TypeGuard.EmbeddablePrimaryType = EmbeddablePrimaryType;
    function AnyPrimaryType(value) {
        return (NonCollectableType(value) ||
            CollectableType(value) ||
            CollectionType(value));
    }
    TypeGuard.AnyPrimaryType = AnyPrimaryType;
})(TypeGuard || (TypeGuard = {}));
exports.default = TypeGuard;
