import type { AssetAbilityIdBase } from "../assets/AssetAbilityId.js";
import type { Gamespace } from "../common/Gamespace.js";
import type { MoveCategoryName } from "../index.js";
export declare type MoveId = `${Gamespace}/${MoveIdBase}`;
export declare type MoveIdBase = `Moves/${MoveCategoryName | "Assets"}/${string}` | `Moves/${AssetAbilityIdBase}/${string}`;
/**
 * Placeholder Move ID indicating that *any* move is valid. For example, an {@link IAlterMove} with this as a `Move` key can be applied to any move that meets its other requirements.
 */
export declare type MoveIdGeneric = `${Gamespace}/${MoveIdGenericBase}`;
export declare type MoveIdGenericBase = "Moves/*";
//# sourceMappingURL=MoveId.d.ts.map