// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Represents a page number in a book.
    /// </summary>
    [JsonConverter(typeof(PageNumberJsonConverter))]
    public class PageNumber
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public short Value { get; set; }
    }

    public class PageNumberJsonConverter : JsonConverter<PageNumber>
    {
        public override PageNumber Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new PageNumber { Value = JsonSerializer.Deserialize<short>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, PageNumber value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<short>(writer, value.Value, options);
        }
    }
}