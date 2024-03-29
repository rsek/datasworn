// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A unique ID for a DelveSiteTheme.
    /// </summary>
    [JsonConverter(typeof(DelveSiteThemeIdJsonConverter))]
    public class DelveSiteThemeId
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class DelveSiteThemeIdJsonConverter : JsonConverter<DelveSiteThemeId>
    {
        public override DelveSiteThemeId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new DelveSiteThemeId { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, DelveSiteThemeId value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}
