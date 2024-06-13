// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(EmbeddedMoveSpecialTrackTypeJsonConverter))]
    public enum EmbeddedMoveSpecialTrackType
    {
        Move,
    }
    public class EmbeddedMoveSpecialTrackTypeJsonConverter : JsonConverter<EmbeddedMoveSpecialTrackType>
    {
        public override EmbeddedMoveSpecialTrackType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "move":
                    return EmbeddedMoveSpecialTrackType.Move;
                default:
                    throw new ArgumentException(String.Format("Bad EmbeddedMoveSpecialTrackType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, EmbeddedMoveSpecialTrackType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case EmbeddedMoveSpecialTrackType.Move:
                    JsonSerializer.Serialize<string>(writer, "move", options);
                    return;
            }
        }
    }
}
