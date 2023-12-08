// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.util.List;

@JsonSerialize
public class TagRuleEnum extends TagRule {
    @JsonProperty("applies_to")
    private List<ObjectType> appliesTo;

    @JsonProperty("array")
    private Boolean array;

    @JsonProperty("description")
    private MarkdownString description;

    @JsonProperty("enum")
    private List<DictKey> enum_;

    public TagRuleEnum() {
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
     * Getter for array.<p>
     */
    public Boolean getArray() {
        return array;
    }

    /**
     * Setter for array.<p>
     */
    public void setArray(Boolean array) {
        this.array = array;
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
     * Getter for enum_.<p>
     */
    public List<DictKey> getEnum_() {
        return enum_;
    }

    /**
     * Setter for enum_.<p>
     */
    public void setEnum_(List<DictKey> enum_) {
        this.enum_ = enum_;
    }
}
