// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(EmbeddedOracleRollableIdWildcardJsonConverter))]
    public class EmbeddedOracleRollableIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class EmbeddedOracleRollableIdWildcardJsonConverter : JsonConverter<EmbeddedOracleRollableIdWildcard>
    {
        public override EmbeddedOracleRollableIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new EmbeddedOracleRollableIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, EmbeddedOracleRollableIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}