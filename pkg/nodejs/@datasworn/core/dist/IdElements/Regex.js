"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CONST_js_1 = __importDefault(require("./CONST.js"));
/**
 * Regular expressions used to validate Datasworn ID elements.
 */
var Regex;
(function (Regex) {
    const DictKeyBase = /[a-z][a-z_]*/;
    Regex.DictKeyElement = DictKeyBase;
    Regex.DictKey = new RegExp(`^${DictKeyBase.source}$`);
    const RulesPackageBase = new RegExp(`[a-z][a-z0-9_]{${CONST_js_1.default.PACKAGE_ID_LENGTH_MIN},}`);
    Regex.RulesPackageElement = RulesPackageBase;
    Regex.RulesPackageId = new RegExp(`^${RulesPackageBase.source}$`);
    Regex.IndexElement = /\d+/;
    const RecursiveDictKeyBase = new RegExp(`${DictKeyBase.source}(?:\\${CONST_js_1.default.Sep}${DictKeyBase.source}){${CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MIN - 1},${CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MAX - 1}}`);
    Regex.RecursiveDictKeyElement = RecursiveDictKeyBase;
})(Regex || (Regex = {}));
exports.default = Regex;
