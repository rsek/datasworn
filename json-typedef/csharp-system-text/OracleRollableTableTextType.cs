// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(OracleRollableTableTextTypeJsonConverter))]
    public enum OracleRollableTableTextType
    {
        OracleRollable,
    }
    public class OracleRollableTableTextTypeJsonConverter : JsonConverter<OracleRollableTableTextType>
    {
        public override OracleRollableTableTextType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "oracle_rollable":
                    return OracleRollableTableTextType.OracleRollable;
                default:
                    throw new ArgumentException(String.Format("Bad OracleRollableTableTextType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, OracleRollableTableTextType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case OracleRollableTableTextType.OracleRollable:
                    JsonSerializer.Serialize<string>(writer, "oracle_rollable", options);
                    return;
            }
        }
    }
}