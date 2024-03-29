// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(SelectValueFieldChoiceStatChoiceTypeJsonConverter))]
    public enum SelectValueFieldChoiceStatChoiceType
    {
        Choice,
    }
    public class SelectValueFieldChoiceStatChoiceTypeJsonConverter : JsonConverter<SelectValueFieldChoiceStatChoiceType>
    {
        public override SelectValueFieldChoiceStatChoiceType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "choice":
                    return SelectValueFieldChoiceStatChoiceType.Choice;
                default:
                    throw new ArgumentException(String.Format("Bad SelectValueFieldChoiceStatChoiceType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, SelectValueFieldChoiceStatChoiceType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case SelectValueFieldChoiceStatChoiceType.Choice:
                    JsonSerializer.Serialize<string>(writer, "choice", options);
                    return;
            }
        }
    }
}
