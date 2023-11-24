// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A rarity, as described in Ironsworn: Delve.
    /// </summary>
    public class Rarity
    {
        /// <summary>
        /// The asset augmented by this rarity.
        /// </summary>
        [JsonPropertyName("asset")]
        public AssetId Asset { get; set; }

        [JsonPropertyName("description")]
        public MarkdownString Description { get; set; }

        [JsonPropertyName("id")]
        public RarityId Id { get; set; }

        [JsonPropertyName("name")]
        public Label Name { get; set; }

        [JsonPropertyName("source")]
        public Source Source { get; set; }

        /// <summary>
        /// From Ironsworn: Delve, p. 174:
        /// 
        ///       Some assets will bring a rarity into play more often than
        /// others, so the experience point cost for a rarity will vary by the
        /// linked asset. These costs are shown in the tables on page 175.
        /// 
        ///       If you are playing solo, and aren’t concerned with the
        /// relative balance of rarity abilities, you can ignore these variable
        /// costs. If so, spend 3 experience points to purchase a rarity.
        /// </summary>
        [JsonPropertyName("xp_cost")]
        public short XpCost { get; set; }

        [JsonPropertyName("canonical_name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Label? CanonicalName { get; set; }

        [JsonPropertyName("icon")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public SvgImageUrl? Icon { get; set; }

        [JsonPropertyName("suggestions")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Suggestions? Suggestions { get; set; }
    }
}