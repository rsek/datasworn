// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// The label at the head of each table column. The `roll` key refers to the
    /// roll column showing the dice range (`min` and `max` on each table row).
    /// </summary>
    public class OracleColumnSimpleColumnLabels
    {
        [JsonPropertyName("result")]
        public Label Result { get; set; }

        [JsonPropertyName("roll")]
        public Label Roll { get; set; }
    }
}
