"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = void 0;
/** Error thrown when parsing Datasworn IDs */
class ParseError extends Error {
    constructor(id, message) {
        super(`Unable to parse Datasworn ID "${id}": ${message}`);
    }
}
exports.ParseError = ParseError;
