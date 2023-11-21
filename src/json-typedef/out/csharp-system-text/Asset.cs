// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    public class Asset
    {
        [JsonPropertyName("abilities")]
        public IList<AssetAbility> Abilities { get; set; }

        /// <summary>
        /// A localized category label for this asset. This is the surtitle
        /// above the asset's name on the card.
        /// </summary>
        [JsonPropertyName("asset_type")]
        public Label AssetType { get; set; }

        /// <summary>
        /// If `true`, this asset counts as an impact (Starforged) or a debility
        /// (classic Ironsworn).
        /// </summary>
        [JsonPropertyName("count_as_impact")]
        public bool CountAsImpact { get; set; }

        [JsonPropertyName("id")]
        public AssetId Id { get; set; }

        [JsonPropertyName("name")]
        public Label Name { get; set; }

        /// <summary>
        /// Most assets only benefit to their owner, but certain assets (like
        /// Starforged's module and command vehicle assets) are shared amongst
        /// the player's allies, too.
        /// </summary>
        [JsonPropertyName("shared")]
        public bool Shared { get; set; }

        [JsonPropertyName("source")]
        public Source Source { get; set; }

        [JsonPropertyName("attachments")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public AssetAttachment? Attachments { get; set; }

        [JsonPropertyName("color")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Csscolor? Color { get; set; }

        /// <summary>
        /// Controls are condition meters, clocks, counters, and other asset
        /// input fields whose values are expected to change throughout the life
        /// of the asset.
        /// </summary>
        [JsonPropertyName("controls")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, AssetControlField> Controls { get; set; }

        [JsonPropertyName("icon")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public SvgimageUrl? Icon { get; set; }

        /// <summary>
        /// Options are asset input fields which are set once, usually when the
        /// character takes the asset. The most common example is the "name"
        /// field on companion assets. A more complex example is the choice of a
        /// god's stat for the Devotant asset.
        /// </summary>
        [JsonPropertyName("options")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, AssetOptionField> Options { get; set; }

        [JsonPropertyName("requirement")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MarkdownString? Requirement { get; set; }

        [JsonPropertyName("suggestions")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Suggestions? Suggestions { get; set; }
    }
}
