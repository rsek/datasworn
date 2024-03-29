// Code generated by jtd-codegen for Java + Jackson v0.2.1

package Datasworn;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * Describes a special track like Bonds (classic Ironsworn), Failure (Delve), or
 * Legacies (Starforged).
 */
@JsonSerialize
public class SpecialTrackRule {
    @JsonProperty("description")
    private MarkdownString description;

    @JsonProperty("label")
    private InputLabel label;

    @JsonProperty("optional")
    private Boolean optional;

    @JsonProperty("shared")
    private Boolean shared;

    public SpecialTrackRule() {
    }

    /**
     * Getter for description.<p>
     * A description of this special track.
     */
    public MarkdownString getDescription() {
        return description;
    }

    /**
     * Setter for description.<p>
     * A description of this special track.
     */
    public void setDescription(MarkdownString description) {
        this.description = description;
    }

    /**
     * Getter for label.<p>
     * A label for this special track.
     */
    public InputLabel getLabel() {
        return label;
    }

    /**
     * Setter for label.<p>
     * A label for this special track.
     */
    public void setLabel(InputLabel label) {
        this.label = label;
    }

    /**
     * Getter for optional.<p>
     * Is this track an optional rule?
     */
    public Boolean getOptional() {
        return optional;
    }

    /**
     * Setter for optional.<p>
     * Is this track an optional rule?
     */
    public void setOptional(Boolean optional) {
        this.optional = optional;
    }

    /**
     * Getter for shared.<p>
     * Is this track shared by all players?
     */
    public Boolean getShared() {
        return shared;
    }

    /**
     * Setter for shared.<p>
     * Is this track shared by all players?
     */
    public void setShared(Boolean shared) {
        this.shared = shared;
    }
}
