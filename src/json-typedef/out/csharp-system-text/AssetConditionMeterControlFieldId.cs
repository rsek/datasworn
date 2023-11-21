// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(AssetConditionMeterControlFieldIdJsonConverter))]
    public class AssetConditionMeterControlFieldId
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class AssetConditionMeterControlFieldIdJsonConverter : JsonConverter<AssetConditionMeterControlFieldId>
    {
        public override AssetConditionMeterControlFieldId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new AssetConditionMeterControlFieldId { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, AssetConditionMeterControlFieldId value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}
