// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    public class TriggerSpecialTrackEnhancement
    {
        [JsonPropertyName("conditions")]
        public IList<TriggerSpecialTrackConditionEnhancement> Conditions { get; set; }
    }
}
