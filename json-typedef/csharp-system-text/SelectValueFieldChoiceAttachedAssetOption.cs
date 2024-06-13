// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Represents an option in a list of choices.
    /// </summary>
    public class SelectValueFieldChoiceAttachedAssetOption : SelectValueFieldChoice
    {
        [JsonPropertyName("using")]
        public string Using { get => "attached_asset_option"; }

        [JsonPropertyName("choice_type")]
        public SelectValueFieldChoiceAttachedAssetOptionChoiceType ChoiceType { get; set; }

        [JsonPropertyName("label")]
        public Label Label { get; set; }

        /// <summary>
        /// The dictionary key of the asset option field.
        /// </summary>
        [JsonPropertyName("option")]
        public DictKey Option { get; set; }
    }
}
