// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A unique ID representing an OracleRollableRow object.
    /// </summary>
    [JsonConverter(typeof(OracleRollableRowIdJsonConverter))]
    public class OracleRollableRowId
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class OracleRollableRowIdJsonConverter : JsonConverter<OracleRollableRowId>
    {
        public override OracleRollableRowId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new OracleRollableRowId { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, OracleRollableRowId value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}