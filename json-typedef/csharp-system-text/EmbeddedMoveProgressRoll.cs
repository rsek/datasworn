// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    public class EmbeddedMoveProgressRoll : EmbeddedMove
    {
        [JsonPropertyName("roll_type")]
        public string RollType { get => "progress_roll"; }

        [JsonPropertyName("_id")]
        public EmbeddedMoveId Id { get; set; }

        /// <summary>
        /// Is burning momentum allowed for this move?
        /// </summary>
        [JsonPropertyName("allow_momentum_burn")]
        public bool AllowMomentumBurn { get; set; }

        /// <summary>
        /// The primary name/label for this node.
        /// </summary>
        [JsonPropertyName("name")]
        public Label Name { get; set; }

        [JsonPropertyName("outcomes")]
        public MoveOutcomes Outcomes { get; set; }

        /// <summary>
        /// The complete rules text of the move.
        /// </summary>
        [JsonPropertyName("text")]
        public MarkdownString Text { get; set; }

        /// <summary>
        /// Describes the common features of progress tracks associated with
        /// this move.
        /// </summary>
        [JsonPropertyName("tracks")]
        public ProgressTrackTypeInfo Tracks { get; set; }

        /// <summary>
        /// Trigger conditions for this move.
        /// </summary>
        [JsonPropertyName("trigger")]
        public TriggerProgressRoll Trigger { get; set; }

        [JsonPropertyName("type")]
        public EmbeddedMoveProgressRollType Type_ { get; set; }

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
        /// An SVG icon associated with this collection.
        /// </summary>
        [JsonPropertyName("icon")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public SvgImageUrl? Icon { get; set; }

        [JsonPropertyName("images")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IList<WebpImageUrl> Images { get; set; }

        [JsonPropertyName("suggestions")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Suggestions? Suggestions { get; set; }

        [JsonPropertyName("tags")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Tags? Tags { get; set; }
    }
}
