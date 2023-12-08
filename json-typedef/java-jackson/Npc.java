// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import java.util.Map;

/**
 * A non-player character entry, similar to those in Chapter 5 of the Ironsworn
 * Rulebook, or Chapter 4 of Starforged.
 */
@JsonSerialize
public class Npc {
    @JsonProperty("description")
    private MarkdownString description;

    @JsonProperty("drives")
    private List<MarkdownString> drives;

    @JsonProperty("features")
    private List<MarkdownString> features;

    @JsonProperty("id")
    private NpcId id;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("nature")
    private NpcNature nature;

    @JsonProperty("rank")
    private ChallengeRank rank;

    @JsonProperty("source")
    private SourceInfo source;

    @JsonProperty("tactics")
    private List<MarkdownString> tactics;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("canonical_name")
    private Label canonicalName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("quest_starter")
    private MarkdownString questStarter;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("suggestions")
    private Suggestions suggestions;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("summary")
    private MarkdownString summary;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("tags")
    private Map<String, Map<String, Tag>> tags;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("variants")
    private Map<String, NpcVariant> variants;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("your_truth")
    private MarkdownString yourTruth;

    public Npc() {
    }

    /**
     * Getter for description.<p>
     */
    public MarkdownString getDescription() {
        return description;
    }

    /**
     * Setter for description.<p>
     */
    public void setDescription(MarkdownString description) {
        this.description = description;
    }

    /**
     * Getter for drives.<p>
     */
    public List<MarkdownString> getDrives() {
        return drives;
    }

    /**
     * Setter for drives.<p>
     */
    public void setDrives(List<MarkdownString> drives) {
        this.drives = drives;
    }

    /**
     * Getter for features.<p>
     */
    public List<MarkdownString> getFeatures() {
        return features;
    }

    /**
     * Setter for features.<p>
     */
    public void setFeatures(List<MarkdownString> features) {
        this.features = features;
    }

    /**
     * Getter for id.<p>
     * The unique Datasworn ID for this item.
     */
    public NpcId getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     * The unique Datasworn ID for this item.
     */
    public void setId(NpcId id) {
        this.id = id;
    }

    /**
     * Getter for name.<p>
     * The primary name/label for this item.
     */
    public Label getName() {
        return name;
    }

    /**
     * Setter for name.<p>
     * The primary name/label for this item.
     */
    public void setName(Label name) {
        this.name = name;
    }

    /**
     * Getter for nature.<p>
     */
    public NpcNature getNature() {
        return nature;
    }

    /**
     * Setter for nature.<p>
     */
    public void setNature(NpcNature nature) {
        this.nature = nature;
    }

    /**
     * Getter for rank.<p>
     * The suggested challenge rank for this NPC.
     */
    public ChallengeRank getRank() {
        return rank;
    }

    /**
     * Setter for rank.<p>
     * The suggested challenge rank for this NPC.
     */
    public void setRank(ChallengeRank rank) {
        this.rank = rank;
    }

    /**
     * Getter for source.<p>
     * Attribution for the original source (such as a book or website) of this
     * item, including the author and licensing information.
     */
    public SourceInfo getSource() {
        return source;
    }

    /**
     * Setter for source.<p>
     * Attribution for the original source (such as a book or website) of this
     * item, including the author and licensing information.
     */
    public void setSource(SourceInfo source) {
        this.source = source;
    }

    /**
     * Getter for tactics.<p>
     */
    public List<MarkdownString> getTactics() {
        return tactics;
    }

    /**
     * Setter for tactics.<p>
     */
    public void setTactics(List<MarkdownString> tactics) {
        this.tactics = tactics;
    }

    /**
     * Getter for canonicalName.<p>
     * The name of this item as it appears on the page in the book, if it's
     * different from `name`.
     */
    public Label getCanonicalName() {
        return canonicalName;
    }

    /**
     * Setter for canonicalName.<p>
     * The name of this item as it appears on the page in the book, if it's
     * different from `name`.
     */
    public void setCanonicalName(Label canonicalName) {
        this.canonicalName = canonicalName;
    }

    /**
     * Getter for questStarter.<p>
     */
    public MarkdownString getQuestStarter() {
        return questStarter;
    }

    /**
     * Setter for questStarter.<p>
     */
    public void setQuestStarter(MarkdownString questStarter) {
        this.questStarter = questStarter;
    }

    /**
     * Getter for suggestions.<p>
     */
    public Suggestions getSuggestions() {
        return suggestions;
    }

    /**
     * Setter for suggestions.<p>
     */
    public void setSuggestions(Suggestions suggestions) {
        this.suggestions = suggestions;
    }

    /**
     * Getter for summary.<p>
     */
    public MarkdownString getSummary() {
        return summary;
    }

    /**
     * Setter for summary.<p>
     */
    public void setSummary(MarkdownString summary) {
        this.summary = summary;
    }

    /**
     * Getter for tags.<p>
     */
    public Map<String, Map<String, Tag>> getTags() {
        return tags;
    }

    /**
     * Setter for tags.<p>
     */
    public void setTags(Map<String, Map<String, Tag>> tags) {
        this.tags = tags;
    }

    /**
     * Getter for variants.<p>
     */
    public Map<String, NpcVariant> getVariants() {
        return variants;
    }

    /**
     * Setter for variants.<p>
     */
    public void setVariants(Map<String, NpcVariant> variants) {
        this.variants = variants;
    }

    /**
     * Getter for yourTruth.<p>
     */
    public MarkdownString getYourTruth() {
        return yourTruth;
    }

    /**
     * Setter for yourTruth.<p>
     */
    public void setYourTruth(MarkdownString yourTruth) {
        this.yourTruth = yourTruth;
    }
}
