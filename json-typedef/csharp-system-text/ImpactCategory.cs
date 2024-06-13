// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// Describes a category of standard impacts/debilities.
    /// </summary>
    public class ImpactCategory
    {
        /// <summary>
        /// A dictionary object of the Impacts in this category.
        /// </summary>
        [JsonPropertyName("contents")]
        public IDictionary<string, ImpactRule> Contents { get; set; }

        /// <summary>
        /// A description of this impact category.
        /// </summary>
        [JsonPropertyName("description")]
        public MarkdownString Description { get; set; }

        /// <summary>
        /// A label for this impact category.
        /// </summary>
        [JsonPropertyName("label")]
        public Label Label { get; set; }
    }
}
