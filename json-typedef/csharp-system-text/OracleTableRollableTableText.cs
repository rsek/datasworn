// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Represents a basic rollable oracle table with one roll column and one
    /// text result column.
    /// </summary>
    public class OracleTableRollableTableText : OracleTableRollable
    {
        [JsonPropertyName("oracle_type")]
        public string OracleType { get => "table_text"; }

        /// <summary>
        /// The unique Datasworn ID for this item.
        /// </summary>
        [JsonPropertyName("_id")]
        public OracleRollableId Id { get; set; }

        /// <summary>
        /// Attribution for the original source (such as a book or website) of
        /// this item, including the author and licensing information.
        /// </summary>
        [JsonPropertyName("_source")]
        public SourceInfo Source { get; set; }

        /// <summary>
        /// The label at the head of each table column. The `roll` key refers
        /// to the roll column showing the dice range (`min` and `max` on each
        /// table row).
        /// </summary>
        [JsonPropertyName("column_labels")]
        public OracleTableRollableTableTextColumnLabels ColumnLabels { get; set; }

        /// <summary>
        /// The roll used to select a result on this oracle.
        /// </summary>
        [JsonPropertyName("dice")]
        public DiceExpression Dice { get; set; }

        /// <summary>
        /// The primary name/label for this item.
        /// </summary>
        [JsonPropertyName("name")]
        public Label Name { get; set; }

        /// <summary>
        /// An array of objects, each representing a single row of the table.
        /// </summary>
        [JsonPropertyName("rows")]
        public IList<OracleTableRowText> Rows { get; set; }

        [JsonPropertyName("type")]
        public OracleTableRollableTableTextType Type_ { get; set; }

        /// <summary>
        /// Any implementation hints or other developer-facing comments on
        /// this object. These should be omitted when presenting the object
        /// for gameplay.
        /// </summary>
        [JsonPropertyName("_comment")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string Comment { get; set; }

        /// <summary>
        /// The name of this item as it appears on the page in the book, if it's
        /// different from `name`.
        /// </summary>
        [JsonPropertyName("canonical_name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Label? CanonicalName { get; set; }

        /// <summary>
        /// A longer description of the oracle table's intended usage, which
        /// might include multiple paragraphs. If it's only a couple sentences,
        /// use the `summary` key instead.
        /// </summary>
        [JsonPropertyName("description")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MarkdownString? Description { get; set; }

        /// <summary>
        /// An icon that represents this table.
        /// </summary>
        [JsonPropertyName("icon")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public SvgImageUrl? Icon { get; set; }

        /// <summary>
        /// Most oracle tables are insensitive to matches, but a few define
        /// special match behavior.
        /// </summary>
        [JsonPropertyName("match")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public OracleMatchBehavior? Match { get; set; }

        [JsonPropertyName("recommended_rolls")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public OracleTableRollableTableTextRecommendedRolls RecommendedRolls { get; set; }

        /// <summary>
        /// Indicates that this object replaces the identified OracleRollable.
        /// References to the replaced object can be considered equivalent to
        /// this object.
        /// </summary>
        [JsonPropertyName("replaces")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public OracleRollableId? Replaces { get; set; }

        [JsonPropertyName("suggestions")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Suggestions? Suggestions { get; set; }

        /// <summary>
        /// A brief summary of the oracle table's intended usage, no more than
        /// a few sentences in length. This is intended for use in application
        /// tooltips and similar sorts of hints. Longer text should use the
        /// "description" key instead.
        /// </summary>
        [JsonPropertyName("summary")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MarkdownString? Summary { get; set; }

        [JsonPropertyName("tags")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, IDictionary<string, Tag>> Tags { get; set; }
    }
}
