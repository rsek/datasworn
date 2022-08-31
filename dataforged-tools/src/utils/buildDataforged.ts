import type { EncounterNatureInfo } from "@classes/cyclopedia/EncounterNatureInfo.js";
import type { EncounterStarforged } from "@classes/index.js";
import { DelveCardType, Gamespace } from "@json_out/index.js";
import type { Ironsworn , Starforged } from "@json_out/index.js";
import { buildAssets } from "@utils/buildAssets.js";
import { buildEncounters } from "@utils/buildEncounters.js";
import { buildMoves } from "@utils/buildMoves.js";
import { buildOracles } from "@utils/buildOracles.js";
import { buildTruths } from "@utils/buildTruths.js";
import { dataforgedStats } from "@utils/dataforgedStats.js";
import { buildLog } from "@utils/logging/buildLog.js";
import { buildDelveSiteCards } from "@utils/buildDelveSiteCards.js";
import { buildIronswornRegions } from "@utils/buildIronswornRegions.js";

/**
 * Builds all data for Dataforged.
 * @returns An object keyed with the game data.
*/
export function buildDataforged(gamespace: Gamespace = Gamespace.Starforged) {
  buildLog(buildDataforged, `Building Dataforged for ${gamespace}...`);
  let data: Ironsworn|Starforged;
  switch (gamespace) {
    case Gamespace.Starforged: {
      data = {
        // $schema: "./schema.json",
        "Asset Types": buildAssets(gamespace),
        Encounters: buildEncounters(gamespace),
        "Move Categories": buildMoves(gamespace),
        "Oracle Categories": buildOracles(gamespace),
        "Setting Truths": buildTruths(gamespace)
      } as Starforged;
      break;}
    case Gamespace.Ironsworn: {
      data = {
        // $schema: "./schema.json",
        "Asset Types":  buildAssets(gamespace),
        Encounters: buildEncounters(gamespace),
        "Move Categories": buildMoves(gamespace),
        "Oracle Categories": buildOracles(gamespace),
        "Setting Truths": buildTruths(gamespace),
        "Site Themes": buildDelveSiteCards(DelveCardType.Theme),
        "Site Domains": buildDelveSiteCards(DelveCardType.Domain),
        Regions: buildIronswornRegions(),
        // Rarities
        // Delve Sites (the sample ones from Delve!)
      } as Ironsworn;
      break;
    }
    default:
      throw new Error();
  }

  buildLog(buildDataforged, `Finished building JSON for ${gamespace}:
    ${dataforgedStats(gamespace, data)}`);
  return data;
}
