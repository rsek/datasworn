// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(AssetControlFieldJsonConverter))]
    public abstract class AssetControlField
    {
    }

    public class AssetControlFieldJsonConverter : JsonConverter<AssetControlField>
    {
        public override AssetControlField Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var readerCopy = reader;
            var tagValue = JsonDocument.ParseValue(ref reader).RootElement.GetProperty("field_type").GetString();

            switch (tagValue)
            {
                case "card_flip":
                    return JsonSerializer.Deserialize<AssetControlFieldCardFlip>(ref readerCopy, options);
                case "checkbox":
                    return JsonSerializer.Deserialize<AssetControlFieldCheckbox>(ref readerCopy, options);
                case "condition_meter":
                    return JsonSerializer.Deserialize<AssetControlFieldConditionMeter>(ref readerCopy, options);
                case "select_enhancement":
                    return JsonSerializer.Deserialize<AssetControlFieldSelectEnhancement>(ref readerCopy, options);
                default:
                    throw new ArgumentException(String.Format("Bad FieldType value: {0}", tagValue));
            }
        }

        public override void Write(Utf8JsonWriter writer, AssetControlField value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, value.GetType(), options);
        }
    }
}