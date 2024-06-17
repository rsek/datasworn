"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachPrimitiveValue = exports.validateIdPointer = exports.validateMarkdownIdPointers = exports.validateMacroIdPointers = exports.validateIdsInStrings = void 0;
const Pattern_js_1 = __importDefault(require("../IdElements/Pattern.js"));
const typeIdPattern = '[a-z][a-z_](?:.[a-z][a-z_]){0,2}';
const dictKeyOrIndexPattern = `[\\/\\.][a-z_0-9]+`;
const pathPattern = `${Pattern_js_1.default.RulesPackageElement.source}(?:${dictKeyOrIndexPattern})+?`;
const idPattern = `(?<typeId>${typeIdPattern}):(?<path>${pathPattern})`;
const idPointerPattern = new RegExp(`^${idPattern}$`);
const linkSymbolPattern = new RegExp([
    `(?<=\\[\\w.+?\\]\\()`, // lookbehind for markdown text in square brackets, plus left paren
    `(?<id>${idPattern})`,
    `(?=\\))` // lookahead for right paren
].join(''), 'g');
const macroSymbolPattern = new RegExp([
    `(?<=\\{\\{)`, // lookbehind for left curly braces
    `(?<directive>[a-z][a-z_]+>)`,
    `(?<id>${idPattern})`,
    `(?=\\}\\})` // lookahead for right curly braces
].join(''), 'g');
function validateIdsInStrings(data, validIds, validatedPointers) {
    const errors = [];
    forEachPrimitiveValue(data, undefined, (v, k) => {
        // skip non-string values
        if (typeof v !== 'string')
            return;
        // skip underscore keys
        if (typeof k === 'string' && k.startsWith('_'))
            return;
        if (idPointerPattern.test(v)) {
            validateIdPointer(v, validIds, validatedPointers);
            // if it's a standalone pointer, markdown checks can be skipped
        }
        else {
            try {
                validateMarkdownIdPointers(v, validIds, validatedPointers);
            }
            catch (e) {
                errors.push(e);
            }
            try {
                validateMacroIdPointers(v, validIds, validatedPointers);
            }
            catch (e) {
                errors.push(e);
            }
        }
    });
    if (errors.length > 0)
        throw new Error(errors.map(String).join('\n'));
    return true;
}
exports.validateIdsInStrings = validateIdsInStrings;
function validateMacroIdPointers(text, validIds, validatedPointers) {
    const macros = text.matchAll(macroSymbolPattern);
    const errors = [];
    for (const macro of macros) {
        if (macro.groups == null)
            continue;
        const { directive, path } = macro.groups;
        switch (directive) {
            case 'table':
            case 'text':
                return validateIdPointer(path, validIds, validatedPointers);
            default:
                errors.push(`Unknown Datasworn macro directive "${String(directive)}": ${macro[0]}`);
        }
    }
    if (errors.length > 0)
        throw new Error(errors.map(String).join('\n'));
    return true;
}
exports.validateMacroIdPointers = validateMacroIdPointers;
function validateMarkdownIdPointers(text, validIds, validatedPointers) {
    const links = text.matchAll(linkSymbolPattern);
    const errors = [];
    for (const link of links) {
        if (link.groups == null)
            continue;
        const { id } = link.groups;
        try {
            validateIdPointer(id, validIds, validatedPointers);
        }
        catch (e) {
            errors.push(e);
        }
    }
    if (errors.length > 0)
        throw new Error(errors.map(String).join('\n'));
    return true;
}
exports.validateMarkdownIdPointers = validateMarkdownIdPointers;
function validateIdPointer(dataswornId, idTracker, validatedPointers) {
    if (!idTracker.has(dataswornId))
        throw Error(`Bad Datasworn ID pointer: ${dataswornId}`);
    if (validatedPointers instanceof Set)
        validatedPointers.add(dataswornId);
    return true;
}
exports.validateIdPointer = validateIdPointer;
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
exports.forEachPrimitiveValue = forEachPrimitiveValue;
