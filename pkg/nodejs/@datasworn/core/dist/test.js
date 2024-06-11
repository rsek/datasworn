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
const collectionString = 'oracle_collection:starforged/core';
const collectableString = 'oracle_rollable:starforged/core/action';
const nonCollectableString = 'truth:starforged/magic';
const recursiveCollectableId = IdParser_js_1.IdParser.parse(collectableString);
const recursiveCollectionId = IdParser_js_1.IdParser.parse(collectionString);
const nonCollectableId = IdParser_js_1.IdParser.parse(nonCollectableString);
for (const id of [
    recursiveCollectableId,
    recursiveCollectionId,
    nonCollectableId
]) {
    console.log(id.id, '=>', id.toGlobberPath().join('.'));
    // console.log(`Retrieved "${id.get()?.name}"`)
}
