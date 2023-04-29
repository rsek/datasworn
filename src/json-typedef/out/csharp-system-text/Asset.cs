// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Dataforged
{
    public class Asset
    {
        [JsonPropertyName("abilities")]
        public IList<AssetAbility> Abilities { get; set; }

        [JsonPropertyName("id")]
        public AssetId Id { get; set; }

        [JsonPropertyName("name")]
        public Label Name { get; set; }

        [JsonPropertyName("source")]
        public Source Source { get; set; }

        [JsonPropertyName("attachments")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public AssetAttachment? Attachments { get; set; }

        [JsonPropertyName("controls")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, AssetControlField> Controls { get; set; }

        /// <summary>
        /// If `true`, this asset counts as an impact (Starforged) or a debility
        /// (classic Ironsworn).
        /// </summary>
        [JsonPropertyName("count_as_impact")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public bool? CountAsImpact { get; set; }

        [JsonPropertyName("options")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, AssetOptionField> Options { get; set; }

        [JsonPropertyName("requirement")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MarkdownString? Requirement { get; set; }

        /// <summary>
        /// Most assets only benefit to their owner, but certain assets (like
        /// Starforged's module and command vehicle assets) are shared amongst
        /// the player's allies, too.
        /// </summary>
        [JsonPropertyName("shared")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public bool? Shared { get; set; }
    }
}