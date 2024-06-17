"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
function validate(collection) {
    const errors = [];
    const { oracle_type } = collection;
    switch (oracle_type) {
        case 'table_shared_rolls':
            try {
                oracleRowsEqualBy(rowHasSameRolls, collection.contents);
            }
            catch (e) {
                // console.table(renderMultiTable(collection.contents, ['roll']))
                throw new Error(`${oracle_type} child OracleRollables must have the same roll ranges in their rows, in the same order. The following rows array indices don't match:\n${e.toString()}`);
            }
            break;
        case 'table_shared_text':
        case 'table_shared_text2':
        case 'table_shared_text3':
            try {
                oracleRowsEqualBy(rowHasSameText, collection.contents);
            }
            catch (e) {
                // console.table(renderMultiTable(collection.contents, ['text']))
                throw new Error(`${oracle_type} child OracleRollables must have the same text content in their rows, in the same order. The following rows array indices don't match:\n${e.toString()}`);
            }
            break;
        case 'tables':
        default:
            break;
    }
    return true;
}
exports.validate = validate;
/**
 *
 * @param equalityFn The function used to test equality of two parallel rows with the same index.
 * @param oracleRollables The OracleRollables to be compared.
 * @return An array of row indices; the rows with index fail at least one equality test.
 */
function oracleRowsEqualBy(equalityFn, oracleRollables) {
    const [[primaryKey, primary], ...secondaries] = Object.entries(oracleRollables);
    const badRowMessages = {};
    for (let rowIndex = 0; rowIndex < primary.rows.length; rowIndex++) {
        const rowA = primary.rows[rowIndex];
        for (const [secondaryKey, secondary] of secondaries) {
            const rowB = secondary.rows[rowIndex];
            try {
                equalityFn(rowA, rowB);
            }
            catch (e) {
                badRowMessages[rowIndex] || (badRowMessages[rowIndex] = []);
                badRowMessages[rowIndex].push(`<${secondaryKey}> ${e.toString()}`);
            }
        }
    }
    const entries = Object.entries(badRowMessages);
    if (entries.length)
        throw new Error(entries.map(([k, v]) => `${k}: ${String(v)}`).join('\n'));
    return true;
}
function rowHasSameRolls(a, b) {
    if (a.roll.min === b.roll.min && a.roll.max === b.roll.max)
        return true;
    throw new Error(`Expected roll range of ${JSON.stringify(a.roll)} but got ${JSON.stringify(b.roll)}`);
}
const textProperties = [
    'text',
    'text2',
    'text3'
];
function rowHasSameText(a, b) {
    for (const k of textProperties) {
        // neither has key -- skip it
        if (!(k in a) && !(k in b))
            continue;
        if (a[k] !== b[k])
            throw new Error(`expected "${k}" to be ${JSON.stringify(a[k])}, but got ${JSON.stringify(b[k])}`);
    }
    return true;
}
function renderMultiTable(oracleRollables, showContent) {
    const tabularData = [];
    const rollableEntries = Object.entries(oracleRollables);
    const [[_, primary]] = rollableEntries;
    for (let rowIndex = 0; rowIndex < primary.rows.length; rowIndex++) {
        const rowData = {};
        for (const [dictKey, oracleRollable] of rollableEntries) {
            const row = oracleRollable.rows[rowIndex];
            let content = '';
            for (const contentKey of showContent) {
                const contentValue = row[contentKey];
                switch (typeof contentValue) {
                    case 'object':
                        if (contentValue === null)
                            content += '(none): ';
                        else if ('max' in contentValue && 'min' in contentValue)
                            content += `${contentValue.min}-${contentValue.max}: `;
                        break;
                    case 'string':
                        content += contentValue.replaceAll(/\[([A-z -]+)\]\([a-z_]+:.+?\)/g, '[$1]');
                        break;
                    default:
                        break;
                }
            }
            rowData[dictKey] = content;
        }
        tabularData.push(rowData);
    }
    return tabularData;
}
