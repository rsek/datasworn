import type { Asset ,  AssetUsage , Display, HasAliases, HasDescription, HasDisplay, HasId , HasSource, HasTitle, Title } from "@schema_json";

export * from "@utils/types/RequireKey.js";

/**
 * Represents an Asset Type such as Command Vehicle, Companion, or Path, and serves as a container for all assets of that type.
 * @public
 */
export interface AssetType extends HasId, HasDescription, HasDisplay, HasSource, HasTitle, Partial<HasAliases>{
  /**
   * @example "Ironsworn/Assets/Ritual"
   * @example "Starforged/Assets/Command_Vehicle"
   * @pattern ^(Starforged|Ironsworn)/Assets/[A-z_-]+$
   */
  $id: string;
  /**
   * The assets that belong to this asset type.
   */
  Assets: Asset[];

  /**
   * @example "Ritual"
   * @example "Command Vehicle"
   * @localize
   */
  Title: Title;
  Display: Display;
  Usage: AssetUsage;
}
