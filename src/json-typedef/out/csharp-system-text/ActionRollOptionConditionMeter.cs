// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    public class ActionRollOptionConditionMeter : ActionRollOption
    {
        [JsonPropertyName("using")]
        public string Using { get => "condition_meter"; }

        [JsonPropertyName("condition_meter")]
        public PlayerConditionMeter ConditionMeter { get; set; }
    }
}
