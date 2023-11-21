// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    public class ActionRollOptionAssetControl : ActionRollOption
    {
        [JsonPropertyName("using")]
        public string Using { get => "asset_control"; }

        [JsonPropertyName("assets")]
        public IList<AssetIdwildcard> Assets { get; set; }

        /// <summary>
        /// The key of the asset control field.
        /// </summary>
        [JsonPropertyName("control")]
        public DictKey Control { get; set; }
    }
}
