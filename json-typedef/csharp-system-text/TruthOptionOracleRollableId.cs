// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A unique ID representing a TruthOptionOracleRollable object.
    /// </summary>
    [JsonConverter(typeof(TruthOptionOracleRollableIdJsonConverter))]
    public class TruthOptionOracleRollableId
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class TruthOptionOracleRollableIdJsonConverter : JsonConverter<TruthOptionOracleRollableId>
    {
        public override TruthOptionOracleRollableId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new TruthOptionOracleRollableId { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, TruthOptionOracleRollableId value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}