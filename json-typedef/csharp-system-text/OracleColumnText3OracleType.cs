// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(OracleColumnText3OracleTypeJsonConverter))]
    public enum OracleColumnText3OracleType
    {
        ColumnText3,
    }
    public class OracleColumnText3OracleTypeJsonConverter : JsonConverter<OracleColumnText3OracleType>
    {
        public override OracleColumnText3OracleType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "column_text3":
                    return OracleColumnText3OracleType.ColumnText3;
                default:
                    throw new ArgumentException(String.Format("Bad OracleColumnText3OracleType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, OracleColumnText3OracleType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case OracleColumnText3OracleType.ColumnText3:
                    JsonSerializer.Serialize<string>(writer, "column_text3", options);
                    return;
            }
        }
    }
}
