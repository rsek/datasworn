// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    public class AssetControlFieldCardFlip : AssetControlField
    {
        [JsonPropertyName("field_type")]
        public string FieldType { get => "card_flip"; }

        /// <summary>
        /// Does this field disable the asset when its value is set to `true`?
        /// </summary>
        [JsonPropertyName("disables_asset")]
        public bool DisablesAsset { get; set; }

        [JsonPropertyName("id")]
        public AssetControlFieldId Id { get; set; }

        /// <summary>
        /// Does this field count as an impact (Starforged) or debility
        /// (Ironsworn classic) when its value is set to `true`?
        /// </summary>
        [JsonPropertyName("is_impact")]
        public bool IsImpact { get; set; }

        /// <summary>
        /// A label for this input. In some contexts it may be undesirable
        /// to render this text, but it should always be exposed to assistive
        /// technology (e.g. with `aria-label` in HTML).
        /// </summary>
        [JsonPropertyName("name")]
        public Label Name { get; set; }

        /// <summary>
        /// Is the card flipped over?
        /// </summary>
        [JsonPropertyName("value")]
        public bool Value { get; set; }
    }
}
