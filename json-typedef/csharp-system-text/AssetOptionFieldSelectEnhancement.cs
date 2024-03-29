// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Select from player and/or asset enhancements. Use it to describe modal
    /// abilities. For examples, see Ironclad (classic Ironsworn) and Windbinder
    /// (Sundered Isles).
    /// </summary>
    public class AssetOptionFieldSelectEnhancement : AssetOptionField
    {
        [JsonPropertyName("field_type")]
        public string FieldType { get => "select_enhancement"; }

        [JsonPropertyName("choices")]
        public IDictionary<string, AssetOptionFieldSelectEnhancementChoice> Choices { get; set; }

        [JsonPropertyName("label")]
        public InputLabel Label { get; set; }

        /// <summary>
        /// The key of the currently selected choice from the `choices`
        /// property, or `null` if none is selected.
        /// </summary>
        [JsonPropertyName("value")]
        public DictKey Value { get; set; }

        /// <summary>
        /// An icon associated with this input.
        /// </summary>
        [JsonPropertyName("icon")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public SvgImageUrl? Icon { get; set; }
    }
}
