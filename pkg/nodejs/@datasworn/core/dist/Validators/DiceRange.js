"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
function validate(obj) {
    if (obj.max < obj.min)
        throw new Error(`DiceRange min (${obj.min}) is greater than max (${obj.max})`);
    return true;
}
exports.validate = validate;
