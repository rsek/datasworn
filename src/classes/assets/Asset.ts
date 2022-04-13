import { AssetAbility } from "@classes/assets/AssetAbility.js";
import { ClockInput, ConditionMeter, NumberInput, SelectInput, SourceInheritor, TextInput } from "@classes/common/index.js";
import type { AssetId, IAsset, IAssetAttachment, IAssetInput, IAssetType, RequireKey, Tuple } from "@json_out/assets/index.js";
import type { Gamespace } from "@json_out/common/Gamespace.js";
import { InputType } from "@json_out/common/index.js";
import type { IDisplay } from "@json_out/meta/index.js";
import { badJsonError } from "@utils/logging/badJsonError.js";
import { buildLog } from "@utils/logging/buildLog.js";
import type { IAssetYaml } from "@yaml_in/assets/index.js";

/**
 * @internal
 */
export class Asset extends SourceInheritor implements IAsset {
  $id: AssetId;
  Name: string;
  Aliases?: string[] | undefined;
  "Asset Type": IAssetType["$id"];
  Display: RequireKey<IDisplay, "Color">;  Attachments?: IAssetAttachment | undefined;
  Requirement?: string | undefined;
  Inputs?: IAssetInput[] | undefined;
  Abilities: Tuple<AssetAbility, 3>;
  "Condition Meter"?: ConditionMeter | undefined;
  constructor(json: IAssetYaml, gamespace: Gamespace, parent: IAssetType) {
    super(json.Source ?? {}, parent.Source);
    this["Asset Type"] = parent.$id;
    this.$id = `${this["Asset Type"]}/${json.Name}`.replaceAll(" ", "_") as AssetId;
    buildLog(this.constructor, `Building: ${this.$id}`);
    this.Name = json.Name;
    this.Aliases = json.Aliases;
    this.Display = {
      Title: json.Display?.Title ?? this.Name,
      Color: json.Display?.Color ?? parent.Display.Color
    };
    this.Attachments = json.Attachments;

    if (json.Inputs) {
      this.Inputs = json.Inputs.map(inputJson => {
        const idString = `${this.$id}/Inputs/${inputJson.Name}`.replaceAll(" ", "_");
        switch (inputJson["Input Type"]) {
          case InputType.Clock: {
            return new ClockInput(inputJson, idString);
          }
          case InputType.Number: {
            return new NumberInput(inputJson, idString);
          }
          case InputType.Select:{
            return new SelectInput(inputJson, idString);
          }
          case InputType.Text: {
            return new TextInput(inputJson, idString);
          }
          default: {
            throw new Error("Unable to assign input data to a type - make sure it's correct.");
          }
        }
      }) as IAssetInput[];
    }
    this.Requirement = json.Requirement;
    if (json.Abilities.length !== 3) {
      throw badJsonError(this.constructor, json.Abilities, `Asset ${this.$id} doesn't have 3 abilities!`);
    }
    this["Condition Meter"] = json["Condition Meter"] ? new ConditionMeter(json["Condition Meter"], this.$id + "/Condition_Meter", this["Asset Type"]) : undefined;
    this.Abilities = json.Abilities.map((abilityJson, index) => new AssetAbility(abilityJson, `${this.$id}/Abilities/${index + 1}`, gamespace, this)) as Tuple<AssetAbility, 3>;
  }
}
