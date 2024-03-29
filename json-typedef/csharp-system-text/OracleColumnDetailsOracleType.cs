// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(OracleColumnDetailsOracleTypeJsonConverter))]
    public enum OracleColumnDetailsOracleType
    {
        ColumnDetails,
    }
    public class OracleColumnDetailsOracleTypeJsonConverter : JsonConverter<OracleColumnDetailsOracleType>
    {
        public override OracleColumnDetailsOracleType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "column_details":
                    return OracleColumnDetailsOracleType.ColumnDetails;
                default:
                    throw new ArgumentException(String.Format("Bad OracleColumnDetailsOracleType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, OracleColumnDetailsOracleType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case OracleColumnDetailsOracleType.ColumnDetails:
                    JsonSerializer.Serialize<string>(writer, "column_details", options);
                    return;
            }
        }
    }
}
