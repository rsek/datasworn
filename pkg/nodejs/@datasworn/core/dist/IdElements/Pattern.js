"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_js_1 = __importDefault(require("./CONST.js"));
/**
 * Regular expressions used to validate Datasworn ID elements.
 */
var Pattern;
(function (Pattern) {
    const DictKeyBase = /[a-z][a-z_]*/;
    Pattern.DictKeyElement = DictKeyBase;
    Pattern.DictKey = new RegExp(`^${DictKeyBase.source}$`);
    const RulesPackageBase = new RegExp(`[a-z][a-z0-9_]{${CONST_js_1.default.PACKAGE_ID_LENGTH_MIN},}`);
    Pattern.RulesPackageElement = RulesPackageBase;
    Pattern.RulesPackageId = new RegExp(`^${RulesPackageBase.source}$`);
    Pattern.IndexElement = /\d+/;
    const RecursiveDictKeysBase = new RegExp(`${DictKeyBase.source}(?:\\${CONST_js_1.default.PathKeySep}${DictKeyBase.source}){${CONST_js_1.default.COLLECTION_DEPTH_MIN - 1},${CONST_js_1.default.COLLECTION_DEPTH_MAX - 1}}`);
    Pattern.RecursiveDictKeysElement = RecursiveDictKeysBase;
})(Pattern || (Pattern = {}));
exports.default = Pattern;
