// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(MoveSpecialTrackTypeJsonConverter))]
    public enum MoveSpecialTrackType
    {
        Move,
    }
    public class MoveSpecialTrackTypeJsonConverter : JsonConverter<MoveSpecialTrackType>
    {
        public override MoveSpecialTrackType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "move":
                    return MoveSpecialTrackType.Move;
                default:
                    throw new ArgumentException(String.Format("Bad MoveSpecialTrackType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, MoveSpecialTrackType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case MoveSpecialTrackType.Move:
                    JsonSerializer.Serialize<string>(writer, "move", options);
                    return;
            }
        }
    }
}
