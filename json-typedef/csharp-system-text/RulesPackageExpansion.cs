// Code generated by jtd-codegen for C# + System.Text.Json v0.2.1

using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Datasworn
{
    /// <summary>
    /// A Datasworn package that relies on an external package to provide its
    /// ruleset.
    /// </summary>
    public class RulesPackageExpansion : RulesPackage
    {
        [JsonPropertyName("package_type")]
        public string PackageType { get => "expansion"; }

        /// <summary>
        /// The version of the Datasworn format used by this data.
        /// </summary>
        [JsonPropertyName("datasworn_version")]
        public SemanticVersion DataswornVersion { get; set; }

        [JsonPropertyName("id")]
        public ExpansionId Id { get; set; }

        [JsonPropertyName("ruleset")]
        public RulesetId Ruleset { get; set; }

        /// <summary>
        /// A dictionary object containing asset collections, which contain
        /// assets.
        /// </summary>
        [JsonPropertyName("assets")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, AssetCollection> Assets { get; set; }

        /// <summary>
        /// A dictionary object containing atlas collections, which contain
        /// atlas entries.
        /// </summary>
        [JsonPropertyName("atlas")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, Atlas> Atlas { get; set; }

        /// <summary>
        /// Lists authors credited by the source material.
        /// </summary>
        [JsonPropertyName("authors")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IList<AuthorInfo> Authors { get; set; }

        /// <summary>
        /// The date of the source documents's last update, formatted YYYY-MM-
        /// DD. Required because it's used to determine whether the data needs
        /// updating.
        /// </summary>
        [JsonPropertyName("date")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public DateTimeOffset? Date { get; set; }

        /// <summary>
        /// A dictionary object of delve sites, like the premade delve sites
        /// presented in Ironsworn: Delve
        /// </summary>
        [JsonPropertyName("delve_sites")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, DelveSite> DelveSites { get; set; }

        [JsonPropertyName("license")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public License? License { get; set; }

        /// <summary>
        /// A dictionary object containing move categories, which contain moves.
        /// </summary>
        [JsonPropertyName("moves")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, MoveCategory> Moves { get; set; }

        /// <summary>
        /// A dictionary object containing NPC collections, which contain NPCs.
        /// </summary>
        [JsonPropertyName("npcs")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, NpcCollection> Npcs { get; set; }

        /// <summary>
        /// A dictionary object containing oracle collections, which may contain
        /// oracle tables and/or oracle collections.
        /// </summary>
        [JsonPropertyName("oracles")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, OracleTablesCollection> Oracles { get; set; }

        /// <summary>
        /// A dictionary object containing rarities, like those presented in
        /// Ironsworn: Delve.
        /// </summary>
        [JsonPropertyName("rarities")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, Rarity> Rarities { get; set; }

        [JsonPropertyName("rules")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public RulesExpansion? Rules { get; set; }

        /// <summary>
        /// A dictionary object containing delve site domains.
        /// </summary>
        [JsonPropertyName("site_domains")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, DelveSiteDomain> SiteDomains { get; set; }

        /// <summary>
        /// A dictionary object containing delve site themes.
        /// </summary>
        [JsonPropertyName("site_themes")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, DelveSiteTheme> SiteThemes { get; set; }

        /// <summary>
        /// The title of the source document.
        /// </summary>
        [JsonPropertyName("title")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string Title { get; set; }

        /// <summary>
        /// A dictionary object of truth categories.
        /// </summary>
        [JsonPropertyName("truths")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public IDictionary<string, Truth> Truths { get; set; }

        /// <summary>
        /// A URL where the source document is available.
        /// </summary>
        [JsonPropertyName("url")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public WebUrl? Url { get; set; }
    }
}
