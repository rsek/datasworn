// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A wildcarded OracleCollectionId that can be used to match multiple
    /// OracleCollection objects.
    /// </summary>
    [JsonConverter(typeof(OracleCollectionIdWildcardJsonConverter))]
    public class OracleCollectionIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class OracleCollectionIdWildcardJsonConverter : JsonConverter<OracleCollectionIdWildcard>
    {
        public override OracleCollectionIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new OracleCollectionIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, OracleCollectionIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}
