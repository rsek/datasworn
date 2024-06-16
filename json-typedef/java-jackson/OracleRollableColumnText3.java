// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

@JsonSerialize
public class OracleRollableColumnText3 extends OracleRollable {
    @JsonProperty("_id")
    private OracleRollableId id;

    @JsonProperty("dice")
    private DiceExpression dice;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("rows")
    private List<OracleRollableRowText3> rows;

    @JsonProperty("type")
    private OracleRollableColumnText3Type type;

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
    @JsonProperty("icon")
    private SvgImageUrl icon;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("images")
    private List<WebpImageUrl> images;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("match")
    private OracleMatchBehavior match;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("recommended_rolls")
    private OracleRollableColumnText3RecommendedRolls recommendedRolls;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("replaces")
    private List<OracleRollableIdWildcard> replaces;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("suggestions")
    private Suggestions suggestions;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("tags")
    private Tags tags;

    public OracleRollableColumnText3() {
    }

    /**
     * Getter for id.<p>
     * The unique Datasworn ID for this node.
     */
    public OracleRollableId getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     * The unique Datasworn ID for this node.
     */
    public void setId(OracleRollableId id) {
        this.id = id;
    }

    /**
     * Getter for dice.<p>
     * The roll used to select a result on this oracle.
     */
    public DiceExpression getDice() {
        return dice;
    }

    /**
     * Setter for dice.<p>
     * The roll used to select a result on this oracle.
     */
    public void setDice(DiceExpression dice) {
        this.dice = dice;
    }

    /**
     * Getter for name.<p>
     * The primary name/label for this node.
     */
    public Label getName() {
        return name;
    }

    /**
     * Setter for name.<p>
     * The primary name/label for this node.
     */
    public void setName(Label name) {
        this.name = name;
    }

    /**
     * Getter for rows.<p>
     * An array of objects, each representing a single row of the table.
     */
    public List<OracleRollableRowText3> getRows() {
        return rows;
    }

    /**
     * Setter for rows.<p>
     * An array of objects, each representing a single row of the table.
     */
    public void setRows(List<OracleRollableRowText3> rows) {
        this.rows = rows;
    }

    /**
     * Getter for type.<p>
     */
    public OracleRollableColumnText3Type getType() {
        return type;
    }

    /**
     * Setter for type.<p>
     */
    public void setType(OracleRollableColumnText3Type type) {
        this.type = type;
    }

    /**
     * Getter for comment.<p>
     * Implementation hints or other developer-facing comments on this node.
     * These should be omitted when presenting the node for gameplay.
     */
    public String getComment() {
        return comment;
    }

    /**
     * Setter for comment.<p>
     * Implementation hints or other developer-facing comments on this node.
     * These should be omitted when presenting the node for gameplay.
     */
    public void setComment(String comment) {
        this.comment = comment;
    }

    /**
     * Getter for canonicalName.<p>
     * The name of this node as it appears on the page in the book, if it's
     * different from `name`.
     */
    public Label getCanonicalName() {
        return canonicalName;
    }

    /**
     * Setter for canonicalName.<p>
     * The name of this node as it appears on the page in the book, if it's
     * different from `name`.
     */
    public void setCanonicalName(Label canonicalName) {
        this.canonicalName = canonicalName;
    }

    /**
     * Getter for color.<p>
     * A thematic color associated with this node.
     */
    public CssColor getColor() {
        return color;
    }

    /**
     * Setter for color.<p>
     * A thematic color associated with this node.
     */
    public void setColor(CssColor color) {
        this.color = color;
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
     * Getter for match.<p>
     * Most oracle tables are insensitive to matches, but a few define special
     * match behavior.
     */
    public OracleMatchBehavior getMatch() {
        return match;
    }

    /**
     * Setter for match.<p>
     * Most oracle tables are insensitive to matches, but a few define special
     * match behavior.
     */
    public void setMatch(OracleMatchBehavior match) {
        this.match = match;
    }

    /**
     * Getter for recommendedRolls.<p>
     */
    public OracleRollableColumnText3RecommendedRolls getRecommendedRolls() {
        return recommendedRolls;
    }

    /**
     * Setter for recommendedRolls.<p>
     */
    public void setRecommendedRolls(OracleRollableColumnText3RecommendedRolls recommendedRolls) {
        this.recommendedRolls = recommendedRolls;
    }

    /**
     * Getter for replaces.<p>
     * This node replaces all nodes that match these wildcards. References to
     * the replaced nodes can be considered equivalent to this node.
     */
    public List<OracleRollableIdWildcard> getReplaces() {
        return replaces;
    }

    /**
     * Setter for replaces.<p>
     * This node replaces all nodes that match these wildcards. References to
     * the replaced nodes can be considered equivalent to this node.
     */
    public void setReplaces(List<OracleRollableIdWildcard> replaces) {
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
}
