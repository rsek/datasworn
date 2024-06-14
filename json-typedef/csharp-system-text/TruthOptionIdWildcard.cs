// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A wildcarded TruthOptionId that can be used to match multiple
    /// TruthOption objects.
    /// </summary>
    [JsonConverter(typeof(TruthOptionIdWildcardJsonConverter))]
    public class TruthOptionIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class TruthOptionIdWildcardJsonConverter : JsonConverter<TruthOptionIdWildcard>
    {
        public override TruthOptionIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new TruthOptionIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, TruthOptionIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}