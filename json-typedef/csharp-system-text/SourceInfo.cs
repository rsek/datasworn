// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Metadata describing the original source of this item
    /// </summary>
    public class SourceInfo
    {
        /// <summary>
        /// Lists authors credited by the source material.
        /// </summary>
        [JsonPropertyName("authors")]
        public IList<AuthorInfo> Authors { get; set; }

        /// <summary>
        /// The date of the source documents's last update, formatted YYYY-MM-
        /// DD. Required because it's used to determine whether the data needs
        /// updating.
        /// </summary>
        [JsonPropertyName("date")]
        public DateTimeOffset Date { get; set; }

        [JsonPropertyName("license")]
        public License License { get; set; }

        /// <summary>
        /// The title of the source document.
        /// </summary>
        [JsonPropertyName("title")]
        public string Title { get; set; }

        /// <summary>
        /// A URL where the source document is available.
        /// </summary>
        [JsonPropertyName("url")]
        public WebUrl Url { get; set; }

        /// <summary>
        /// The page number where this item is described in full.
        /// </summary>
        [JsonPropertyName("page")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public ushort? Page { get; set; }
    }
}
