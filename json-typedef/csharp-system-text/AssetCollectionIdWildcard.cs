// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A wildcarded AssetCollectionId that can be used to match multiple
    /// AssetCollection objects.
    /// </summary>
    [JsonConverter(typeof(AssetCollectionIdWildcardJsonConverter))]
    public class AssetCollectionIdWildcard
    {
        /// <summary>
        /// The underlying data being wrapped.
        /// </summary>
        public string Value { get; set; }
    }

    public class AssetCollectionIdWildcardJsonConverter : JsonConverter<AssetCollectionIdWildcard>
    {
        public override AssetCollectionIdWildcard Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return new AssetCollectionIdWildcard { Value = JsonSerializer.Deserialize<string>(ref reader, options) };
        }

        public override void Write(Utf8JsonWriter writer, AssetCollectionIdWildcard value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize<string>(writer, value.Value, options);
        }
    }
}
