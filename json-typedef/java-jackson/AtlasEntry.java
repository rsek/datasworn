// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

/**
 * An atlas entry, like the Ironlands region entries found in classic Ironsworn.
 */
@JsonSerialize
public class AtlasEntry {
    @JsonProperty("_id")
    private AtlasEntryId id;

    @JsonProperty("_source")
    private SourceInfo source;

    @JsonProperty("description")
    private MarkdownString description;

    @JsonProperty("features")
    private List<MarkdownString> features;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("type")
    private AtlasEntryType type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("_comment")
    private String comment;

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
    private Tags tags;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("your_truth")
    private MarkdownString yourTruth;

    public AtlasEntry() {
    }

    /**
     * Getter for id.<p>
     * The unique Datasworn ID for this item.
     */
    public AtlasEntryId getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     * The unique Datasworn ID for this item.
     */
    public void setId(AtlasEntryId id) {
        this.id = id;
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
     * Getter for type.<p>
     */
    public AtlasEntryType getType() {
        return type;
    }

    /**
     * Setter for type.<p>
     */
    public void setType(AtlasEntryType type) {
        this.type = type;
    }

    /**
     * Getter for comment.<p>
     * Implementation hints or other developer-facing comments on this object.
     * These should be omitted when presenting the object for gameplay.
     */
    public String getComment() {
        return comment;
    }

    /**
     * Setter for comment.<p>
     * Implementation hints or other developer-facing comments on this object.
     * These should be omitted when presenting the object for gameplay.
     */
    public void setComment(String comment) {
        this.comment = comment;
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
    public Tags getTags() {
        return tags;
    }

    /**
     * Setter for tags.<p>
     */
    public void setTags(Tags tags) {
        this.tags = tags;
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
