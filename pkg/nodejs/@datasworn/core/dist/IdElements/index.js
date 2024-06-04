"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONST = exports.PathKeys = exports.Pattern = exports.TypeGuard = exports.NodeTypeId = void 0;
var NodeTypeId_js_1 = require("./NodeTypeId.js");
Object.defineProperty(exports, "NodeTypeId", { enumerable: true, get: function () { return __importDefault(NodeTypeId_js_1).default; } });
var TypeGuard_js_1 = require("./TypeGuard.js");
Object.defineProperty(exports, "TypeGuard", { enumerable: true, get: function () { return __importDefault(TypeGuard_js_1).default; } });
var Pattern_js_1 = require("./Pattern.js");
Object.defineProperty(exports, "Pattern", { enumerable: true, get: function () { return __importDefault(Pattern_js_1).default; } });
exports.PathKeys = __importStar(require("./PathKeys.js"));
var CONST_js_1 = require("./CONST.js");
Object.defineProperty(exports, "CONST", { enumerable: true, get: function () { return __importDefault(CONST_js_1).default; } });
