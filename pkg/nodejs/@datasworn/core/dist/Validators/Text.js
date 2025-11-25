"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idLike = void 0;
exports.needsIdValidation = needsIdValidation;
exports.extractIdRefs = extractIdRefs;
exports.forEachIdRef = forEachIdRef;
exports.validateIdsInStrings = validateIdsInStrings;
exports.validateMacroIdPointers = validateMacroIdPointers;
exports.validateMarkdownIdPointers = validateMarkdownIdPointers;
exports.validateIdPointer = validateIdPointer;
exports.forEachPrimitiveValue = forEachPrimitiveValue;
const CONST_js_1 = require("../IdElements/CONST.js");
const Pattern_js_1 = __importDefault(require("../IdElements/Pattern.js"));
const typeIdPattern = '[a-z][a-z_](?:\\.[a-z][a-z_]){0,2}';
const dictKeyOrIndexPattern = `[\\/\\.](?:[a-z_0-9\\]|\\*{1,2})+`;
const pathPattern = `${Pattern_js_1.default.RulesPackageElement.source}(?:${dictKeyOrIndexPattern})+`;
// (?<path>
//   (?:[a-z_]+|\*{1,2})
//   (?:\/
//      (?:[a-z\d_.]+|\*{1,2})+
//    )+
// |\*{2})
exports.idLike = /(?<typeId>[a-z\d_.]{3,}|\*{1,2}):(?<path>(?:[a-z_]+|\*{1,2})(?:\/(?:[a-z\d_.]+|\*{1,2})+)+|\*{2})/g;
const idPointerPattern = new RegExp(`^${exports.idLike}$`);
const linkSymbolPattern = new RegExp([
    `(?<=\\[\\w.+?\\]\\(${CONST_js_1.MdLinkPrefix}${CONST_js_1.PrefixSep})`, // lookbehind for markdown text in square brackets, plus left paren
    `(?<id>${exports.idLike})`,
    `(?=\\))`, // lookahead for right paren
].join(''), 'g');
const macroSymbolPattern = new RegExp([
    `(?<=\\{\\{)`, // lookbehind for left curly braces
    `(?<directive>[a-z][a-z_]+>)`,
    `(?<id>${exports.idLike})`,
    `(?=\\}\\})`, // lookahead for right curly braces
].join(''), 'g');
const plainTextKeys = new Set([
    'label',
    '_comment',
    'name',
    'title',
    'category',
]);
const urlKeys = new Set(['url', 'license', 'icon']);
const nonTextKeys = new Set(['dice']);
const markdownKeys = new Set([
    'text',
    'description',
    'summary',
    'quest_starter',
    'your_truth',
]);
const idBlacklist = new Set([
    ' / ',
    ',',
    '. ',
    ': ',
    '[',
    ']',
    '(',
    ')',
    '{',
    '}',
    '>',
    '<',
    "'",
    '"',
    '://',
    '.svg',
    '.webp',
]);
function isBareId(v) {
    if (typeof v !== 'string')
        return false;
    if (!v.includes('/') || !v.includes(':'))
        return false;
    // check for character sequences that can occur only in markdown strings
    for (const char of idBlacklist)
        if (v.includes(char))
            return false;
    return true;
}
function needsIdValidation(k, v) {
    if (!(typeof k === 'number' || typeof k === 'string'))
        return false;
    if (typeof v !== 'string')
        return false;
    switch (true) {
        case k === CONST_js_1.IdKey:
        case plainTextKeys.has(k):
        case urlKeys.has(k):
        case nonTextKeys.has(k):
        case !v.includes('/'):
        case !v.includes(':'):
            return false;
    }
    return true;
}
function extractIdRefs(data) {
    const extractedIds = new Set();
    forEachIdRef(data, extractedIds.add);
    return extractedIds;
}
function forEachIdRef(data, forEach) {
    forEachPrimitiveValue(data, undefined, (v, k) => {
        if (typeof v !== 'string')
            return;
        if (!needsIdValidation(k, v))
            return;
        const ids = v.matchAll(exports.idLike);
        if (ids == null)
            return;
        for (const match of ids)
            forEach(match[0]);
    });
}
function validateIdsInStrings(data, index) {
    const errors = [];
    const extractedIds = new Set();
    forEachPrimitiveValue(data, undefined, (v, k) => {
        if (!needsIdValidation(k, v))
            return;
        const ids = v.matchAll(exports.idLike);
        if (ids == null)
            return;
        for (const match of ids) {
            extractedIds.add(match[0]);
        }
        // if (isBareId(v))
        // appears to be a standalone pointer
        // 	try {
        // 		validateIdPointer(v, index)
        // 	} catch (e) {
        // 		errors.push(e)
        // 	}
        // else {
        // 	try {
        // 		validateMarkdownIdPointers(v, index)
        // 	} catch (e: any) {
        // 		errors.push(e)
        // 	}
        // 	try {
        // 		validateMacroIdPointers(v, index)
        // 	} catch (e: any) {
        // 		errors.push(e)
        // 	}
        // }
    });
    if (errors.length > 0)
        throw new Error(errors.map((e) => String(e)).join('\n'));
    return true;
}
function validateMacroIdPointers(text, validIds) {
    const macros = text.matchAll(macroSymbolPattern);
    const errors = [];
    for (const macro of macros) {
        if (macro.groups == null)
            continue;
        const { directive, path } = macro.groups;
        switch (directive) {
            case 'table':
            case 'text':
            case 'table_columns':
                return validateIdPointer(path, validIds);
            default:
                errors.push(`Unknown Datasworn macro directive "${String(directive)}": ${macro[0]}`);
        }
    }
    if (errors.length > 0)
        throw new Error(errors.map((e) => e.toString()).join('\n'));
    return true;
}
function validateMarkdownIdPointers(text, validIds) {
    const links = text.matchAll(linkSymbolPattern);
    const errors = [];
    for (const link of links) {
        if (link.groups == null)
            continue;
        const { id } = link.groups;
        try {
            validateIdPointer(id, validIds);
        }
        catch (e) {
            errors.push(e);
        }
    }
    if (errors.length > 0)
        throw new Error(errors.map((e) => String(e)).join('\n'));
    return true;
}
const testStr = '[Bannersworn](datasworn:asset:starforged/path/bannersworn); [Diplomat](datasworn:asset:starforged/path/diplomat)';
// for (const f of testStr.matchAll(idPattern)) {
// 	console.log(f)
// }
function validateIdPointer(id, index) {
    if (!index.has(id))
        throw Error(`Bad Datasworn ID pointer: ${id}`);
    return true;
}
/** Recursively iterates over JSON values, applying a function to every primitive boolean, number, string, and null value. */
function forEachPrimitiveValue(value, key, fn) {
    switch (typeof value) {
        case 'undefined':
            break;
        case 'boolean':
        case 'number':
        case 'string':
            fn(value, key);
            break;
        case 'object':
            if (value === null)
                fn(value, key);
            else if (Array.isArray(value))
                value.forEach((v, k) => {
                    forEachPrimitiveValue(v, k, fn);
                });
            else
                for (const k in value)
                    forEachPrimitiveValue(value[k], k, fn);
            break;
        default:
            throw Error('Unrecognized type');
    }
}
