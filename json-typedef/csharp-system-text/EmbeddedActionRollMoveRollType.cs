// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(EmbeddedActionRollMoveRollTypeJsonConverter))]
    public enum EmbeddedActionRollMoveRollType
    {
        ActionRoll,
    }
    public class EmbeddedActionRollMoveRollTypeJsonConverter : JsonConverter<EmbeddedActionRollMoveRollType>
    {
        public override EmbeddedActionRollMoveRollType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "action_roll":
                    return EmbeddedActionRollMoveRollType.ActionRoll;
                default:
                    throw new ArgumentException(String.Format("Bad EmbeddedActionRollMoveRollType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, EmbeddedActionRollMoveRollType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case EmbeddedActionRollMoveRollType.ActionRoll:
                    JsonSerializer.Serialize<string>(writer, "action_roll", options);
                    return;
            }
        }
    }
}
