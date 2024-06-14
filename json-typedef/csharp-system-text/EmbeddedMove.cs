// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(EmbeddedMoveJsonConverter))]
    public abstract class EmbeddedMove
    {
    }

    public class EmbeddedMoveJsonConverter : JsonConverter<EmbeddedMove>
    {
        public override EmbeddedMove Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var readerCopy = reader;
            var tagValue = JsonDocument.ParseValue(ref reader).RootElement.GetProperty("roll_type").GetString();

            switch (tagValue)
            {
                case "action_roll":
                    return JsonSerializer.Deserialize<EmbeddedMoveActionRoll>(ref readerCopy, options);
                case "no_roll":
                    return JsonSerializer.Deserialize<EmbeddedMoveNoRoll>(ref readerCopy, options);
                case "progress_roll":
                    return JsonSerializer.Deserialize<EmbeddedMoveProgressRoll>(ref readerCopy, options);
                case "special_track":
                    return JsonSerializer.Deserialize<EmbeddedMoveSpecialTrack>(ref readerCopy, options);
                default:
                    throw new ArgumentException(String.Format("Bad RollType value: {0}", tagValue));
            }
        }

        public override void Write(Utf8JsonWriter writer, EmbeddedMove value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, value.GetType(), options);
        }
    }
}