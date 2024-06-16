// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// An OracleCollection representing a single table with multiple roll
    /// columns and one text column.
    /// </summary>
    public class OracleTableSharedText
    {
        /// <summary>
        /// The unique Datasworn ID for this node.
        /// </summary>
        [JsonPropertyName("_id")]
        public OracleCollectionId Id { get; set; }

        /// <summary>
        /// Attribution for the original source (such as a book or website) of
        /// this node, including the author and licensing information.
        /// </summary>
        [JsonPropertyName("_source")]
        public SourceInfo Source { get; set; }

        /// <summary>
        /// The label at the head of each table column. The `roll` key refers
        /// to the roll column showing the dice range (`min` and `max` on each
        /// table row).
        /// </summary>
        [JsonPropertyName("column_labels")]
        public OracleTableSharedTextColumnLabels ColumnLabels { get; set; }

        [JsonPropertyName("contents")]
        public IDictionary<string, OracleColumnText> Contents { get; set; }

        /// <summary>
        /// The primary name/label for this node.
        /// </summary>
        [JsonPropertyName("name")]
        public Label Name { get; set; }

        [JsonPropertyName("oracle_type")]
        public OracleTableSharedTextOracleType OracleType { get; set; }

        [JsonPropertyName("type")]
        public OracleTableSharedTextType Type_ { get; set; }

        /// <summary>
        /// Implementation hints or other developer-facing comments on this
        /// node. These should be omitted when presenting the node for gameplay.
        /// </summary>
        [JsonPropertyName("_comment")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string Comment { get; set; }

        /// <summary>
        /// The name of this node as it appears on the page in the book, if it's
        /// different from `name`.
        /// </summary>
        [JsonPropertyName("canonical_name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Label? CanonicalName { get; set; }

        /// <summary>
        /// A thematic color associated with this node.
        /// </summary>
        [JsonPropertyName("color")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public CssColor? Color { get; set; }

        /// <summary>
        /// A longer description of this collection, which might include
        /// multiple paragraphs. If it's only a couple sentences, use the
        /// `summary` key instead.
        /// </summary>
        [JsonPropertyName("description")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MarkdownString? Description { get; set; }

        /// <summary>
        /// This node's content enhances all nodes that match these wildcards,
        /// rather than being a standalone item of its own.
        /// </summary>
        [JsonPropertyName("enhances")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IList<OracleCollectionIdWildcard> Enhances { get; set; }

        /// <summary>
        /// An SVG icon associated with this collection.
        /// </summary>
        [JsonPropertyName("icon")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public SvgImageUrl? Icon { get; set; }

        [JsonPropertyName("images")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IList<WebpImageUrl> Images { get; set; }

        /// <summary>
        /// This node replaces all nodes that match these wildcards. References
        /// to the replaced nodes can be considered equivalent to this node.
        /// </summary>
        [JsonPropertyName("replaces")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IList<OracleCollectionIdWildcard> Replaces { get; set; }

        [JsonPropertyName("suggestions")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Suggestions? Suggestions { get; set; }

        /// <summary>
        /// A brief summary of this collection, no more than a few sentences
        /// in length. This is intended for use in application tooltips and
        /// similar sorts of hints. Longer text should use the "description"
        /// key instead.
        /// </summary>
        [JsonPropertyName("summary")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MarkdownString? Summary { get; set; }

        [JsonPropertyName("tags")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Tags? Tags { get; set; }
    }
}
