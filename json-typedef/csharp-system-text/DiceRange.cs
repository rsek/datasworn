// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Represents a range of dice roll results, bounded by `min` and `max`
    /// (inclusive).
    /// </summary>
    public class DiceRange
    {
        /// <summary>
        /// High end of the dice range.
        /// </summary>
        [JsonPropertyName("max")]
        public short Max { get; set; }

        /// <summary>
        /// Low end of the dice range.
        /// </summary>
        [JsonPropertyName("min")]
        public short Min { get; set; }
    }
}