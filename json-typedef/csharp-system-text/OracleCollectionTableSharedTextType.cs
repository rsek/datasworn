// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(OracleCollectionTableSharedTextTypeJsonConverter))]
    public enum OracleCollectionTableSharedTextType
    {
        OracleCollection,
    }
    public class OracleCollectionTableSharedTextTypeJsonConverter : JsonConverter<OracleCollectionTableSharedTextType>
    {
        public override OracleCollectionTableSharedTextType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "oracle_collection":
                    return OracleCollectionTableSharedTextType.OracleCollection;
                default:
                    throw new ArgumentException(String.Format("Bad OracleCollectionTableSharedTextType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, OracleCollectionTableSharedTextType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case OracleCollectionTableSharedTextType.OracleCollection:
                    JsonSerializer.Serialize<string>(writer, "oracle_collection", options);
                    return;
            }
        }
    }
}
