// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Represents an option in a list of choices.
    /// </summary>
    public class SelectValueFieldChoiceAssetControl : SelectValueFieldChoice
    {
        [JsonPropertyName("using")]
        public string Using { get => "asset_control"; }

        [JsonPropertyName("assets")]
        public IList<AssetIdWildcard> Assets { get; set; }

        [JsonPropertyName("choice_type")]
        public SelectValueFieldChoiceAssetControlChoiceType ChoiceType { get; set; }

        /// <summary>
        /// The dictionary key of the asset control field.
        /// </summary>
        [JsonPropertyName("control")]
        public DictKey Control { get; set; }

        [JsonPropertyName("label")]
        public InputLabel Label { get; set; }
    }
}
