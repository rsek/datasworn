// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(AnyOracleRollableRowIdWildcardJsonConverter))]
    public class AnyOracleRollableRowIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class AnyOracleRollableRowIdWildcardJsonConverter : JsonConverter<AnyOracleRollableRowIdWildcard>
    {
        public override AnyOracleRollableRowIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new AnyOracleRollableRowIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, AnyOracleRollableRowIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}