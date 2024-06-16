"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const CONST_js_1 = __importDefault(require("../IdElements/CONST.js"));
function validate(obj, collectionValidator, collectableValidator) {
    collectionValidator(obj);
    if (CONST_js_1.default.ContentsKey in obj) {
        const children = obj[CONST_js_1.default.ContentsKey];
        for (const k in children)
            collectableValidator(children[k]);
    }
    if (CONST_js_1.default.CollectionsKey in obj) {
        const collectionChildren = obj[CONST_js_1.default.CollectionsKey];
        for (const k in collectionChildren)
            validate(collectionChildren[k], collectionValidator, collectableValidator);
    }
    return true;
}
exports.validate = validate;
