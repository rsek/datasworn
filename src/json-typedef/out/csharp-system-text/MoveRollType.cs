// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    [JsonConverter(typeof(MoveRollTypeJsonConverter))]
    public enum MoveRollType
    {
        ActionRoll,

        NoRoll,

        ProgressRoll,

        SpecialTrack,
    }
    public class MoveRollTypeJsonConverter : JsonConverter<MoveRollType>
    {
        public override MoveRollType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = JsonSerializer.Deserialize<string>(ref reader, options);
            switch (value)
            {
                case "action_roll":
                    return MoveRollType.ActionRoll;
                case "no_roll":
                    return MoveRollType.NoRoll;
                case "progress_roll":
                    return MoveRollType.ProgressRoll;
                case "special_track":
                    return MoveRollType.SpecialTrack;
                default:
                    throw new ArgumentException(String.Format("Bad MoveRollType value: {0}", value));
            }
        }

        public override void Write(Utf8JsonWriter writer, MoveRollType value, JsonSerializerOptions options)
        {
            switch (value)
            {
                case MoveRollType.ActionRoll:
                    JsonSerializer.Serialize<string>(writer, "action_roll", options);
                    return;
                case MoveRollType.NoRoll:
                    JsonSerializer.Serialize<string>(writer, "no_roll", options);
                    return;
                case MoveRollType.ProgressRoll:
                    JsonSerializer.Serialize<string>(writer, "progress_roll", options);
                    return;
                case MoveRollType.SpecialTrack:
                    JsonSerializer.Serialize<string>(writer, "special_track", options);
                    return;
            }
        }
    }
}
