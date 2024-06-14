// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(OracleTableTextTypeJsonConverter))]
    public enum OracleTableTextType
    {
        OracleRollable,
    }
    public class OracleTableTextTypeJsonConverter : JsonConverter<OracleTableTextType>
    {
        public override OracleTableTextType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "oracle_rollable":
                    return OracleTableTextType.OracleRollable;
                default:
                    throw new ArgumentException(String.Format("Bad OracleTableTextType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, OracleTableTextType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case OracleTableTextType.OracleRollable:
                    JsonSerializer.Serialize<string>(writer, "oracle_rollable", options);
                    return;
            }
        }
    }
}