// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import java.util.Map;

@JsonSerialize
public class NpcCollection {
    @JsonProperty("_id")
    private NpcCollectionId id;

    @JsonProperty("_source")
    private SourceInfo source;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("type")
    private NpcCollectionType type;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("_comment")
    private String comment;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("canonical_name")
    private Label canonicalName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("color")
    private CssColor color;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("contents")
    private Map<String, Npc> contents;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("description")
    private MarkdownString description;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("enhances")
    private NpcCollectionId enhances;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("icon")
    private SvgImageUrl icon;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("images")
    private List<WebpImageUrl> images;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("replaces")
    private NpcCollectionId replaces;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("suggestions")
    private Suggestions suggestions;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("summary")
    private MarkdownString summary;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("tags")
    private Map<String, Map<String, Tag>> tags;

    public NpcCollection() {
    }

    /**
     * Getter for id.<p>
     * The unique Datasworn ID for this item.
     */
    public NpcCollectionId getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     * The unique Datasworn ID for this item.
     */
    public void setId(NpcCollectionId id) {
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
    public NpcCollectionType getType() {
        return type;
    }

    /**
     * Setter for type.<p>
     */
    public void setType(NpcCollectionType type) {
        this.type = type;
    }

    /**
     * Getter for comment.<p>
     * Any implementation hints or other developer-facing comments on this
     * object. These should be omitted when presenting the object for gameplay.
     */
    public String getComment() {
        return comment;
    }

    /**
     * Setter for comment.<p>
     * Any implementation hints or other developer-facing comments on this
     * object. These should be omitted when presenting the object for gameplay.
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
     * Getter for color.<p>
     * A thematic color associated with this collection.
     */
    public CssColor getColor() {
        return color;
    }

    /**
     * Setter for color.<p>
     * A thematic color associated with this collection.
     */
    public void setColor(CssColor color) {
        this.color = color;
    }

    /**
     * Getter for contents.<p>
     */
    public Map<String, Npc> getContents() {
        return contents;
    }

    /**
     * Setter for contents.<p>
     */
    public void setContents(Map<String, Npc> contents) {
        this.contents = contents;
    }

    /**
     * Getter for description.<p>
     * A longer description of this collection, which might include multiple
     * paragraphs. If it's only a couple sentences, use the `summary` key
     * instead.
     */
    public MarkdownString getDescription() {
        return description;
    }

    /**
     * Setter for description.<p>
     * A longer description of this collection, which might include multiple
     * paragraphs. If it's only a couple sentences, use the `summary` key
     * instead.
     */
    public void setDescription(MarkdownString description) {
        this.description = description;
    }

    /**
     * Getter for enhances.<p>
     * This collection's content enhances the identified collection, rather than
     * being a standalone collection of its own.
     */
    public NpcCollectionId getEnhances() {
        return enhances;
    }

    /**
     * Setter for enhances.<p>
     * This collection's content enhances the identified collection, rather than
     * being a standalone collection of its own.
     */
    public void setEnhances(NpcCollectionId enhances) {
        this.enhances = enhances;
    }

    /**
     * Getter for icon.<p>
     * An SVG icon associated with this collection.
     */
    public SvgImageUrl getIcon() {
        return icon;
    }

    /**
     * Setter for icon.<p>
     * An SVG icon associated with this collection.
     */
    public void setIcon(SvgImageUrl icon) {
        this.icon = icon;
    }

    /**
     * Getter for images.<p>
     */
    public List<WebpImageUrl> getImages() {
        return images;
    }

    /**
     * Setter for images.<p>
     */
    public void setImages(List<WebpImageUrl> images) {
        this.images = images;
    }

    /**
     * Getter for replaces.<p>
     * This collection replaces the identified collection. References to the
     * replaced collection can be considered equivalent to this collection.
     */
    public NpcCollectionId getReplaces() {
        return replaces;
    }

    /**
     * Setter for replaces.<p>
     * This collection replaces the identified collection. References to the
     * replaced collection can be considered equivalent to this collection.
     */
    public void setReplaces(NpcCollectionId replaces) {
        this.replaces = replaces;
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
     * A brief summary of this collection, no more than a few sentences in
     * length. This is intended for use in application tooltips and similar
     * sorts of hints. Longer text should use the "description" key instead.
     */
    public MarkdownString getSummary() {
        return summary;
    }

    /**
     * Setter for summary.<p>
     * A brief summary of this collection, no more than a few sentences in
     * length. This is intended for use in application tooltips and similar
     * sorts of hints. Longer text should use the "description" key instead.
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
}
