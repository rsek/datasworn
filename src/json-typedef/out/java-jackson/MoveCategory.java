// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;
import java.util.Map;

@JsonSerialize
public class MoveCategory {
    @JsonProperty("id")
    private String id;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("source")
    private Source source;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("canonical_name")
    private Label canonicalName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("color")
    private Csscolor color;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("contents")
    private Map<String, Move> contents;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("description")
    private MarkdownString description;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("enhances")
    private MoveCategoryId enhances;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("icon")
    private SvgimageUrl icon;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("images")
    private List<WebpimageUrl> images;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("replaces")
    private MoveCategoryId replaces;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("suggestions")
    private Suggestions suggestions;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("summary")
    private MarkdownString summary;

    public MoveCategory() {
    }

    /**
     * Getter for id.<p>
     */
    public String getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Getter for name.<p>
     */
    public Label getName() {
        return name;
    }

    /**
     * Setter for name.<p>
     */
    public void setName(Label name) {
        this.name = name;
    }

    /**
     * Getter for source.<p>
     */
    public Source getSource() {
        return source;
    }

    /**
     * Setter for source.<p>
     */
    public void setSource(Source source) {
        this.source = source;
    }

    /**
     * Getter for canonicalName.<p>
     */
    public Label getCanonicalName() {
        return canonicalName;
    }

    /**
     * Setter for canonicalName.<p>
     */
    public void setCanonicalName(Label canonicalName) {
        this.canonicalName = canonicalName;
    }

    /**
     * Getter for color.<p>
     */
    public Csscolor getColor() {
        return color;
    }

    /**
     * Setter for color.<p>
     */
    public void setColor(Csscolor color) {
        this.color = color;
    }

    /**
     * Getter for contents.<p>
     */
    public Map<String, Move> getContents() {
        return contents;
    }

    /**
     * Setter for contents.<p>
     */
    public void setContents(Map<String, Move> contents) {
        this.contents = contents;
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
     * Getter for enhances.<p>
     * This collection's content enhances the identified collection, rather than
     * being a standalone collection of its own.
     */
    public MoveCategoryId getEnhances() {
        return enhances;
    }

    /**
     * Setter for enhances.<p>
     * This collection's content enhances the identified collection, rather than
     * being a standalone collection of its own.
     */
    public void setEnhances(MoveCategoryId enhances) {
        this.enhances = enhances;
    }

    /**
     * Getter for icon.<p>
     */
    public SvgimageUrl getIcon() {
        return icon;
    }

    /**
     * Setter for icon.<p>
     */
    public void setIcon(SvgimageUrl icon) {
        this.icon = icon;
    }

    /**
     * Getter for images.<p>
     */
    public List<WebpimageUrl> getImages() {
        return images;
    }

    /**
     * Setter for images.<p>
     */
    public void setImages(List<WebpimageUrl> images) {
        this.images = images;
    }

    /**
     * Getter for replaces.<p>
     * This collection replaces the identified collection. References to the
     * replaced collection can be considered equivalent to this collection.
     */
    public MoveCategoryId getReplaces() {
        return replaces;
    }

    /**
     * Setter for replaces.<p>
     * This collection replaces the identified collection. References to the
     * replaced collection can be considered equivalent to this collection.
     */
    public void setReplaces(MoveCategoryId replaces) {
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
}
