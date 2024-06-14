// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A wildcarded DelveSiteThemeDangerId that can be used to match multiple
    /// DelveSiteThemeDanger objects.
    /// </summary>
    [JsonConverter(typeof(DelveSiteThemeDangerIdWildcardJsonConverter))]
    public class DelveSiteThemeDangerIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class DelveSiteThemeDangerIdWildcardJsonConverter : JsonConverter<DelveSiteThemeDangerIdWildcard>
    {
        public override DelveSiteThemeDangerIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new DelveSiteThemeDangerIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, DelveSiteThemeDangerIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}