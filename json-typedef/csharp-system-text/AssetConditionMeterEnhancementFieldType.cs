// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(AssetConditionMeterEnhancementFieldTypeJsonConverter))]
    public enum AssetConditionMeterEnhancementFieldType
    {
        ConditionMeter,
    }
    public class AssetConditionMeterEnhancementFieldTypeJsonConverter : JsonConverter<AssetConditionMeterEnhancementFieldType>
    {
        public override AssetConditionMeterEnhancementFieldType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "condition_meter":
                    return AssetConditionMeterEnhancementFieldType.ConditionMeter;
                default:
                    throw new ArgumentException(String.Format("Bad AssetConditionMeterEnhancementFieldType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, AssetConditionMeterEnhancementFieldType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case AssetConditionMeterEnhancementFieldType.ConditionMeter:
                    JsonSerializer.Serialize<string>(writer, "condition_meter", options);
                    return;
            }
        }
    }
}