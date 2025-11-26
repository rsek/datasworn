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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.compareRanges = compareRanges;
const OracleRollableRow = __importStar(require("./OracleRollableRow.js"));
const diceExpressionPattern = /^(?<numberOfDice>[1-9][0-9]*)d(?<sides>[1-9][0-9]*)(?<modifier>[+-]([1-9][0-9]*))?$/;
function validate(object) {
    validateTableRollRanges(object, false);
    return true;
}
// assumes that rows are sorted sequentially
function validateTableRollRanges(oracleRollable, sort = false) {
    var _a;
    const { min: rollMin, max: rollMax } = getDiceRange(oracleRollable.dice);
    const rows = sort
        ? oracleRollable.rows.sort(compareRanges)
        : oracleRollable.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        // unrollable row for cosmetic purposes -- doesn't need validation
        if (row.roll == null)
            continue;
        const { min, max } = row.roll;
        // basic validation of a single row's contents
        try {
            OracleRollableRow.validate(row);
        }
        catch (e) {
            throw new Error(`@ index ${i}: ${String(e)}`);
        }
        // min and max must both be null or both be integers
        if (min < rollMin)
            throw new Error(`@ index ${i}: roll.min (${min}) is less than the minimum possible roll of ${oracleRollable.dice} (${rollMin})`);
        if (max > rollMax)
            throw new Error(`@ index ${i}: roll.max (${max}) is greater than the maximum possible roll of ${oracleRollable.dice} (${rollMax})`);
        // what happens if there's blank rows intermixed, rather than a block at the start?
        // would this be easier if we compared the next row instead?
        // alternately, we could filter these ahead of time?
        // or set the last numbered row as a variable?
        const previousRow = (_a = rows[i - 1]) !== null && _a !== void 0 ? _a : null;
        if ((previousRow === null || previousRow === void 0 ? void 0 : previousRow.roll) == null)
            continue;
        if (min !== previousRow.roll.max + 1)
            throw new Error(`@ index ${i}: Roll range (${min}-${max}) is not sequential with previous row (${previousRow.roll.min}-${previousRow.roll.max}).`);
    }
    return true;
}
function getDiceRange(diceExpression) {
    var _a;
    const parsed = (_a = diceExpressionPattern.exec(diceExpression)) === null || _a === void 0 ? void 0 : _a.groups;
    if (parsed == null)
        throw new Error(`Could not parse ${String(diceExpression)} as a dice expression.`);
    const [numberOfDice, sides, modifier] = Object.values(parsed).map((numberString, i) => {
        const n = Number(numberString);
        if (Number.isNaN(n))
            return 0;
        if (!Number.isInteger(n))
            throw new Error(`Dice expression elements must be an integer value`);
        return n;
    });
    const min = numberOfDice + modifier;
    const max = numberOfDice * sides + modifier;
    return { min, max };
}
/**
 *
 * @param a The first row to compare.
 * @param b The second row to compare.
 * @returns `-1` if `a` comes before `b`, `1` if `b` comes before `a`, or `0` if the sort order is unchanged.
 */
function compareRanges(a, b) {
    if (a.roll == null && b.roll == null)
        return 0;
    if (a.roll == null && b.roll != null)
        return -1;
    if (a.roll != null && b.roll == null)
        return 1;
    return a.roll.min < b.roll.min ? -1 : b.roll.min > a.roll.min ? 1 : 0;
}
