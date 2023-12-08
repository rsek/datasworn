// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

@JsonSerialize
public class TagRuleDelveSiteDomain extends TagRule {
    @JsonProperty("applies_to")
    private List<ObjectType> appliesTo;

    @JsonProperty("description")
    private MarkdownString description;

    @JsonProperty("wildcard")
    private Boolean wildcard;

    public TagRuleDelveSiteDomain() {
    }

    /**
     * Getter for appliesTo.<p>
     */
    public List<ObjectType> getAppliesTo() {
        return appliesTo;
    }

    /**
     * Setter for appliesTo.<p>
     */
    public void setAppliesTo(List<ObjectType> appliesTo) {
        this.appliesTo = appliesTo;
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
     * Getter for wildcard.<p>
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this
     * field accepts a single non-wildcard ID.
     */
    public Boolean getWildcard() {
        return wildcard;
    }

    /**
     * Setter for wildcard.<p>
     * If `true`, this field accepts an array of wildcard IDs. If `false`, this
     * field accepts a single non-wildcard ID.
     */
    public void setWildcard(Boolean wildcard) {
        this.wildcard = wildcard;
    }
}
