"use strict";
/**
 * A very lazy test script. If TS complains about TypeErrors in here, then something is broken!
 */
Object.defineProperty(exports, "__esModule", { value: true });
const IdParser_js_1 = require("./IdParser.js");
// import { readFileSync } from 'fs'
// const path = './datasworn/starforged/starforged.json'
// IdParser.datasworn = {
// 	starforged: JSON.parse(readFileSync(path, { encoding: 'utf-8' }))
// }
const recursiveCollectionString = 'starforged/oracle_collection/core';
const recursiveCollectableString = 'starforged/oracle_rollable/core/action';
const nonRecursiveCollectionString = 'starforged/move_category/combat';
const nonRecursiveCollectableString = 'starforged/move/combat/strike';
const nonCollectableString = 'starforged/truth/magic';
const recursiveCollectableId = IdParser_js_1.IdParser.fromString(recursiveCollectableString);
const nonRecursiveCollectionId = IdParser_js_1.IdParser.fromString(nonRecursiveCollectionString);
const recursiveCollectionId = IdParser_js_1.IdParser.fromString(recursiveCollectionString);
const nonRecursiveCollectableId = IdParser_js_1.IdParser.fromString(nonRecursiveCollectableString);
const nonCollectableId = IdParser_js_1.IdParser.fromString(nonCollectableString);
for (const id of [
    recursiveCollectableId,
    recursiveCollectionId,
    nonRecursiveCollectableId,
    nonRecursiveCollectionId,
    nonCollectableId
]) {
    console.log(id.toString(), '=>', id.toPath().join('.'));
    // console.log(`Retrieved "${id.get()?.name}"`)
}
