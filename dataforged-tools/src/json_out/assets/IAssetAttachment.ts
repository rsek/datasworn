import type { IAssetType } from "@json_out/assets/IAssetType.js";

/**
 * Details which assets are valid attachments. The most prominent example in *Ironsworn: Starforged* is the STARSHIP asset (`Assets/Command_Vehicle/Starship`); Rover (`Assets/Support_Vehicle/Rover`) also has an elective ability that adds this property.
 * @public
 */
export interface IAssetAttachment {
  /**
   * The type of asset that this asset accepts as attachments.
   */
  "Asset Types": IAssetType["$id"][];
  /**
   * The maximum number of attached assets accepted by this asset. If undefined or null, there is no maximum.
   */
  "Max": number | null;
}