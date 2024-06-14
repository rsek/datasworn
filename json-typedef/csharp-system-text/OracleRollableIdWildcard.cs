// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A wildcarded OracleRollableId that can be used to match multiple
    /// OracleRollable objects.
    /// </summary>
    [JsonConverter(typeof(OracleRollableIdWildcardJsonConverter))]
    public class OracleRollableIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class OracleRollableIdWildcardJsonConverter : JsonConverter<OracleRollableIdWildcard>
    {
        public override OracleRollableIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new OracleRollableIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, OracleRollableIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}