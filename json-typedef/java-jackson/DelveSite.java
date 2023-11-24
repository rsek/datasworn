// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

/**
 * A delve site with a theme, domain, and denizen table.
 */
@JsonSerialize
public class DelveSite {
    @JsonProperty("denizens")
    private List<DelveSiteDenizen> denizens;

    @JsonProperty("description")
    private MarkdownString description;

    @JsonProperty("domain")
    private DelveSiteDomainId domain;

    @JsonProperty("id")
    private DelveSiteId id;

    @JsonProperty("name")
    private Label name;

    @JsonProperty("rank")
    private ChallengeRank rank;

    @JsonProperty("source")
    private Source source;

    @JsonProperty("theme")
    private DelveSiteThemeId theme;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("canonical_name")
    private Label canonicalName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("extra_card")
    private String extraCard;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("icon")
    private SvgImageUrl icon;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("region")
    private AtlasEntryId region;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("suggestions")
    private Suggestions suggestions;

    public DelveSite() {
    }

    /**
     * Getter for denizens.<p>
     */
    public List<DelveSiteDenizen> getDenizens() {
        return denizens;
    }

    /**
     * Setter for denizens.<p>
     */
    public void setDenizens(List<DelveSiteDenizen> denizens) {
        this.denizens = denizens;
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
     * Getter for domain.<p>
     */
    public DelveSiteDomainId getDomain() {
        return domain;
    }

    /**
     * Setter for domain.<p>
     */
    public void setDomain(DelveSiteDomainId domain) {
        this.domain = domain;
    }

    /**
     * Getter for id.<p>
     */
    public DelveSiteId getId() {
        return id;
    }

    /**
     * Setter for id.<p>
     */
    public void setId(DelveSiteId id) {
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
     * Getter for rank.<p>
     */
    public ChallengeRank getRank() {
        return rank;
    }

    /**
     * Setter for rank.<p>
     */
    public void setRank(ChallengeRank rank) {
        this.rank = rank;
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
     * Getter for theme.<p>
     */
    public DelveSiteThemeId getTheme() {
        return theme;
    }

    /**
     * Setter for theme.<p>
     */
    public void setTheme(DelveSiteThemeId theme) {
        this.theme = theme;
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
     * Getter for extraCard.<p>
     * An additional theme or domain card ID, for use with optional rules in
     * Ironsworn: Delve.
     */
    public String getExtraCard() {
        return extraCard;
    }

    /**
     * Setter for extraCard.<p>
     * An additional theme or domain card ID, for use with optional rules in
     * Ironsworn: Delve.
     */
    public void setExtraCard(String extraCard) {
        this.extraCard = extraCard;
    }

    /**
     * Getter for icon.<p>
     */
    public SvgImageUrl getIcon() {
        return icon;
    }

    /**
     * Setter for icon.<p>
     */
    public void setIcon(SvgImageUrl icon) {
        this.icon = icon;
    }

    /**
     * Getter for region.<p>
     * The ID of an atlas entry representing the region in which this delve site
     * is located.
     */
    public AtlasEntryId getRegion() {
        return region;
    }

    /**
     * Setter for region.<p>
     * The ID of an atlas entry representing the region in which this delve site
     * is located.
     */
    public void setRegion(AtlasEntryId region) {
        this.region = region;
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
}