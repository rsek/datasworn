// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A reference to the value of a standard player character stat.
    /// </summary>
    public class StatValueRef
    {
        [JsonPropertyName("stat")]
        public StatKey Stat { get; set; }

        /// <summary>
        /// A reference to the value of a standard player character stat.
        /// </summary>
        [JsonPropertyName("using")]
        public StatValueRefUsing Using { get; set; }
    }
}