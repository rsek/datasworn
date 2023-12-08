// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    public class TagRuleBoolean : TagRule
    {
        [JsonPropertyName("value_type")]
        public string ValueType_ { get => "boolean"; }

        [JsonPropertyName("applies_to")]
        public IList<ObjectType> AppliesTo { get; set; }

        [JsonPropertyName("array")]
        public bool Array_ { get; set; }

        [JsonPropertyName("description")]
        public MarkdownString Description { get; set; }
    }
}