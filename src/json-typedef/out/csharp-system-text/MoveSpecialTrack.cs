// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    public class MoveSpecialTrack : Move
    {
        [JsonPropertyName("roll_type")]
        public string RollType { get => "special_track"; }

        [JsonPropertyName("id")]
        public MoveId Id { get; set; }

        [JsonPropertyName("name")]
        public Label Name { get; set; }

        [JsonPropertyName("outcomes")]
        public MoveOutcomes Outcomes { get; set; }

        [JsonPropertyName("source")]
        public Source Source { get; set; }

        /// <summary>
        /// The complete rules text of the move.
        /// </summary>
        [JsonPropertyName("text")]
        public MarkdownString Text { get; set; }

        [JsonPropertyName("trigger")]
        public TriggerSpecialTrack Trigger { get; set; }

        [JsonPropertyName("canonical_name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Label? CanonicalName { get; set; }

        /// <summary>
        /// Oracles associated with this move. It's not recommended to roll
        /// these automatically, as almost all moves present them as an option,
        /// not a requirement.
        /// </summary>
        [JsonPropertyName("oracles")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IList<OracleTableId> Oracles { get; set; }

        /// <summary>
        /// Indicates that this move replaces the identified move. References to
        /// the replaced move can be considered equivalent to this move.
        /// </summary>
        [JsonPropertyName("replaces")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public MoveId? Replaces { get; set; }

        [JsonPropertyName("suggestions")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Suggestions? Suggestions { get; set; }
    }
}
