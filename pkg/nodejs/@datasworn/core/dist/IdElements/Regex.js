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
    Regex.DictKeyElement = new RegExp(`(${DictKeyBase.source})`);
    Regex.DictKey = new RegExp(`^${DictKeyBase.source}$`);
    const RulesPackageBase = new RegExp(`[a-z][a-z0-9_]{${CONST_js_1.default.PACKAGE_ID_LENGTH_MIN},}`);
    Regex.RulesPackageElement = new RegExp(`(${RulesPackageBase.source})`);
    Regex.RulesPackageId = new RegExp(`^${RulesPackageBase.source}$`);
    const RecursiveDictKeyBase = new RegExp(`${DictKeyBase.source}(?:\\${CONST_js_1.default.Sep}${DictKeyBase.source}){${CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MIN - 1},${CONST_js_1.default.RECURSIVE_PATH_ELEMENTS_MAX - 1}}`);
    Regex.RecursiveDictKeyElement = new RegExp(`(${RecursiveDictKeyBase.source})`);
})(Regex || (Regex = {}));
exports.default = Regex;
