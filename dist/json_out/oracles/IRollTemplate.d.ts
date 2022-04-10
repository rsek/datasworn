import type { FragmentString, MdString, OracleTableId, ParagraphsString, SentenceString } from "../index.js";
import type { SettingTruthId } from "../setting_truths/SettingTruthName";
/**
 * Represents a template string to be filled with results from specific oracle tables.
 *
 */
export declare type RollTemplateString = MdString & (FragmentString | SentenceString | ParagraphsString) & `${string | ""}\${{${SettingTruthId | OracleTableId | OracleSubtableId}}}${string | ""}`;
/**
 * An ID valid for a subtable embedded in a table Row.
 *
 */
export declare type OracleSubtableId = `${SettingTruthId | OracleTableId}/${number}-${number}/Subtable` | `${SettingTruthId | OracleTableId}/${number}/Subtable`;
/**
 * Describes the string keys of this item that should be replaced with template strings and filled with the results of one or more oracles.
 *
 */
declare type RollTemplate<T extends string> = {
    [P in T | never]?: RollTemplateString | undefined;
};
export { RollTemplate };
//# sourceMappingURL=IRollTemplate.d.ts.map