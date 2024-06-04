"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayIs = void 0;
function arrayIs(a, b) {
    if (a.length !== b.length)
        return false;
    return a.every((valueA, i) => {
        const valueB = b[i];
        if (Array.isArray(valueA) && Array.isArray(valueB))
            return arrayIs(valueA, valueB);
        return Object.is(valueA, valueB);
    });
}
exports.arrayIs = arrayIs;
